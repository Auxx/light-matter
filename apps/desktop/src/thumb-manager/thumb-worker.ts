import { closeSync, openSync, readSync } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { extname } from 'node:path';
import { parentPort } from 'node:worker_threads';
import { ImageHistogram } from 'internal-api';
import Vips from 'wasm-vips';

export interface ThumbWorkerGenerateRequest {
  type?: 'generate';
  id: string;
  source: string;
  target: string;
  width: number;
  height: number;
}

export interface ThumbWorkerCancelRequest {
  type: 'cancel';
  id: string;
}

export interface ThumbWorkerHistogramRequest {
  type: 'histogram';
  id: string;
  source: string;
}

export type ThumbWorkerRequest = ThumbWorkerGenerateRequest | ThumbWorkerCancelRequest | ThumbWorkerHistogramRequest;

export interface ThumbWorkerResponse {
  id: string;
  success: boolean;
  error?: string;
  histogram?: ImageHistogram;
}

const cancelledRequests = new Set<string>();

let vipsInstance: typeof Vips | null = null;
interface JpegXrDecoder {
  decode: (data: Uint8Array) => {
    width: number;
    height: number;
    pixelInfo: { bitDepth: string; channels: number; bgr: boolean };
    bytes: Uint8Array;
  };
}

interface AvifColorProfile {
  primaries: number;
  transfer: number;
}

interface HeifImage {
  handle: unknown;
  free: () => void;
  get_width: () => number;
  get_height: () => number;
  display: (
    imageData: { data: Uint8ClampedArray; width: number; height: number },
    callback: (result: { data: Uint8ClampedArray; width: number; height: number } | null) => void
  ) => void;
}

interface HeifDecodeResult {
  image: unknown;
  width: number;
  height: number;
  channels: Array<{ data: Uint8Array; stride: number; bits_per_pixel: number }>;
}

interface HeifDecoderModule {
  HeifDecoder: new () => { decoder: unknown; decode: (data: Uint8Array) => HeifImage[] };
  heif_context_free: (context: unknown) => void;
  heif_colorspace: { heif_colorspace_RGB: unknown };
  heif_chroma: { heif_chroma_interleaved_RRGGBB_LE: unknown };
  heif_js_decode_image2: (handle: unknown, colorSpace: unknown, chroma: unknown) => HeifDecodeResult;
  heif_image_release: (image: unknown) => void;
}

interface ExrDecoderModule {
  init: () => Promise<void>;
  decodeRgbExr: (data: Uint8Array) => {
    width: number;
    height: number;
    interleavedRgbPixels: Float32Array;
  };
}

let jpegxrInstance: Promise<JpegXrDecoder> | null = null;
let heifDecoderModule: HeifDecoderModule | null = null;
let exrDecoderModule: Promise<ExrDecoderModule> | null = null;
const transferLuts = new Map<number, Float32Array>();

async function getVips(): Promise<typeof Vips> {
  if (!vipsInstance) {
    vipsInstance = await Vips();
    // The gallery processes mostly unique files, so operation caching only retains
    // decoded source graphs without providing useful cache hits.
    vipsInstance.Cache.max(0);
    vipsInstance.Cache.maxMem(0);
  }
  return vipsInstance;
}

function getJpegXr() {
  if (!jpegxrInstance) {
    const createJpegXr = require('jpegxr') as () => Promise<JpegXrDecoder>;
    jpegxrInstance = createJpegXr();
  }

  return jpegxrInstance;
}

function getHeifDecoder(): HeifDecoderModule {
  if (!heifDecoderModule) {
    heifDecoderModule = require('libheif-js/wasm-bundle') as HeifDecoderModule;
  }

  return heifDecoderModule;
}

function releaseHeifImage(module: HeifDecoderModule, decoder: InstanceType<HeifDecoderModule['HeifDecoder']>, image?: HeifImage) {
  image?.free();
  if (decoder.decoder) {
    module.heif_context_free(decoder.decoder);
    decoder.decoder = null;
  }
}

function getExrDecoder(): Promise<ExrDecoderModule> {
  if (!exrDecoderModule) {
    const decoder = require('exrs') as ExrDecoderModule;
    exrDecoderModule = decoder.init().then(() => decoder);
  }

  return exrDecoderModule;
}

function decodeHeifToRgba(data: Uint8Array): Promise<{ data: Uint8ClampedArray; width: number; height: number }> {
  const module = getHeifDecoder();
  const decoder = new module.HeifDecoder();
  const image = decoder.decode(data)[0];

  if (!image) {
    releaseHeifImage(module, decoder);
    throw new Error('The HEIF file does not contain a decodable image.');
  }

  const width = image.get_width();
  const height = image.get_height();
  const imageData = { data: new Uint8ClampedArray(width * height * 4), width, height };

  return new Promise((resolve, reject) => {
    try {
      image.display(imageData, result => {
        releaseHeifImage(module, decoder, image);

        if (result) {
          resolve(result);
        } else {
          reject(new Error('The HEIF image could not be decoded.'));
        }
      });
    } catch (error) {
      releaseHeifImage(module, decoder, image);
      reject(error);
    }
  });
}

function decodeHeifHdrToVips(vips: typeof Vips, data: Uint8Array) {
  const module = getHeifDecoder();
  const decoder = new module.HeifDecoder();
  const image = decoder.decode(data)[0];

  if (!image) {
    releaseHeifImage(module, decoder);
    throw new Error('The HEIF file does not contain a decodable image.');
  }

  const width = image.get_width();
  const height = image.get_height();

  const decoded = module.heif_js_decode_image2(
    image.handle,
    module.heif_colorspace.heif_colorspace_RGB,
    module.heif_chroma.heif_chroma_interleaved_RRGGBB_LE
  );

  try {
    const channel = decoded.channels[0];
    const bits = channel?.bits_per_pixel ?? 0;
    const stride = channel?.stride ?? 0;

    if (!decoded.image || !channel || bits < 8 || bits > 16 || stride < width * 6) {
      throw new Error(`Unsupported HEIF HDR pixel format: ${bits} bits per channel.`);
    }

    const maxCode = (1 << bits) - 1;
    const pixels = new Uint16Array(width * height * 3);
    const view = new DataView(channel.data.buffer, channel.data.byteOffset, channel.data.byteLength);

    for (let y = 0; y < height; y++) {
      let sourceOffset = y * stride;
      let targetOffset = y * width * 3;

      for (let x = 0; x < width; x++) {
        pixels[targetOffset++] = Math.round(view.getUint16(sourceOffset, true) * 65535 / maxCode);
        pixels[targetOffset++] = Math.round(view.getUint16(sourceOffset + 2, true) * 65535 / maxCode);
        pixels[targetOffset++] = Math.round(view.getUint16(sourceOffset + 4, true) * 65535 / maxCode);
        sourceOffset += 6;
      }
    }

    return vips.Image.newFromMemory(pixels, width, height, 3, vips.BandFormat.ushort);
  } finally {
    if (decoded.image) {
      module.heif_image_release(decoded.image);
    }
    releaseHeifImage(module, decoder, image);
  }
}

function halfFloatToFloat(half: number): number {
  const sign = half & 0x8000 ? -1 : 1;
  const exponent = (half >>> 10) & 0x1f;
  const fraction = half & 0x03ff;

  if (exponent === 0) {
    return sign * Math.pow(2, -14) * (fraction / 1024);
  }

  if (exponent === 0x1f) {
    return fraction === 0 ? sign * Infinity : Number.NaN;
  }

  return sign * Math.pow(2, exponent - 15) * (1 + fraction / 1024);
}

function getHeifColorProfile(data: Uint8Array): AvifColorProfile | null {
  for (let index = 0; index <= data.length - 11; index++) {
    if (data[index] === 0x6e && data[index + 1] === 0x63 && data[index + 2] === 0x6c && data[index + 3] === 0x78) {
      return {
        primaries: (data[index + 4] << 8) | data[index + 5],
        transfer: (data[index + 6] << 8) | data[index + 7]
      };
    }
  }

  return null;
}

function hasComfyUiPqVae(source: string): boolean {
  // ComfyUI embeds its workflow in PNG text chunks. This targeted marker also
  // covers files whose HDR colour-profile chunks (cICP/mDCV/cLLI) are absent.
  // Search the raw PNG bytes so both tEXt and uncompressed iTXt metadata work.
  try {
    const data = require('node:fs').readFileSync(source) as Buffer;
    return data.includes(Buffer.from('sdxlRec2100PQVAEFor_v10.safetensors', 'ascii'));
  } catch {
    return false;
  }
}

function getPngColorProfile(source: string): AvifColorProfile | null {
  let fd: number | undefined;

  try {
    fd = openSync(source, 'r');
    const signature = Buffer.alloc(8);

    if (readSync(fd, signature, 0, signature.length, 0) !== signature.length ||
      !signature.equals(Buffer.from([ 137, 80, 78, 71, 13, 10, 26, 10 ]))) {
      return null;
    }

    let offset = 8;

    // PNG colour-profile chunks, including cICP, appear before the image data.
    while (true) {
      const header = Buffer.alloc(8);

      if (readSync(fd, header, 0, header.length, offset) !== header.length) {
        return null;
      }

      const length = header.readUInt32BE(0);
      const type = header.toString('ascii', 4, 8);

      if (type === 'cICP' && length >= 4) {
        const profile = Buffer.alloc(4);

        if (readSync(fd, profile, 0, profile.length, offset + 8) !== profile.length) {
          return null;
        }

        return { primaries: profile[0], transfer: profile[1] };
      }

      if (type === 'IDAT' || type === 'IEND') {
        return null;
      }

      offset += 12 + length;
    }
  } catch {
    return null;
  } finally {
    if (fd !== undefined) {
      closeSync(fd);
    }
  }
}

function getHdrTransferLut(transfer: number): Float32Array {
  const cached = transferLuts.get(transfer);
  if (cached) {
    return cached;
  }

  const lut = new Float32Array(65536);

  for (let code = 0; code < lut.length; code++) {
    const value = code / 65535;

    if (transfer === 16) {
      const m1 = 2610 / 16384;
      const m2 = 2523 / 32;
      const c1 = 3424 / 4096;
      const c2 = 2413 / 128;
      const c3 = 2392 / 128;
      const powered = Math.pow(value, 1 / m2);
      const numerator = Math.max(powered - c1, 0);
      const denominator = c2 - c3 * powered;
      lut[code] = Math.pow(numerator / denominator, 1 / m1) * 10000 / 80;
    } else {
      const a = 0.17883277;
      const b = 1 - 4 * a;
      const c = 0.5 - a * Math.log(4 * a);
      lut[code] = value <= 0.5
        ? value * value / 3
        : (Math.exp((value - c) / a) + b) / 12;
    }
  }

  transferLuts.set(transfer, lut);
  return lut;
}

function hlgOotf(vips: typeof Vips, sceneLinear: Vips.Image): Vips.Image {
  using luminanceMatrix = vips.Image.newMatrix(3, 1, [ 0.2627, 0.6780, 0.0593 ]);
  using sceneLuminance = sceneLinear.recomb(luminanceMatrix);
  using displayScale = sceneLuminance.pow(0.2).linear([ 1000 / 80 ], [ 0 ]);
  return sceneLinear.multiply(displayScale);
}

function histogramForImage(vips: typeof Vips, source: string): ImageHistogram {
  using fullImage = vips.Image.newFromFile(source, { access: 'random' });
  const scale = Math.min(1, 512 / fullImage.width, 512 / fullImage.height);
  using smallImage = scale < 1 ? fullImage.resize(scale, { kernel: vips.Kernel.linear }) : fullImage.copy();
  using rgb = smallImage.bands >= 3 ? smallImage.extractBand(0, { n: 3 }) : vips.Image.bandjoin([
    smallImage.extractBand(0), smallImage.extractBand(0), smallImage.extractBand(0)
  ]);
  const sdrPixels = rgb.writeToMemory();
  const sdrMax = sdrPixels instanceof Uint8Array ? 255 : sdrPixels instanceof Uint16Array ? 65535 : 1;
  const pixelCount = Math.floor(sdrPixels.length / 3);
  let hdrPixels: typeof sdrPixels | null = null;

  try {
    using hdrImage = fullImage.uhdr2scRGB();
    using hdrSmall = scale < 1 ? hdrImage.resize(scale, { kernel: vips.Kernel.linear }) : hdrImage.copy();
    using hdrRgb = hdrSmall.bands >= 3 ? hdrSmall.extractBand(0, { n: 3 }) : hdrSmall;
    hdrPixels = hdrRgb.writeToMemory();
  } catch {
    // Ordinary SDR images do not contain an Ultra HDR gain map.
  }

  if (!hdrPixels && fullImage.format === 'uchar' && fullImage.bands >= 3 &&
    extname(source).toLowerCase() === '.png') {
    const profile = getPngColorProfile(source);

    if ((profile?.primaries === 9 && profile.transfer === 16) || hasComfyUiPqVae(source)) {
      // Convert 8-bit Rec. 2020 PQ codes to the 16-bit LUT domain.
      using encodedRgb = fullImage.extractBand(0, { n: 3 }).cast(vips.BandFormat.ushort).linear([ 257 ], [ 0 ]);
      using lut = vips.Image.newFromMemory(getHdrTransferLut(16), 65536, 1, 1, vips.BandFormat.float);
      using linearRec2020 = encodedRgb.maplut(lut);
      using matrix = vips.Image.newMatrix(3, 3, [
        1.660491, -0.587641, -0.072850,
        -0.124550, 1.132900, -0.008349,
        -0.018151, -0.100579, 1.118730
      ]);
      using linearScRgb = linearRec2020.recomb(matrix);
      using smallHdr = scale < 1 ? linearScRgb.resize(scale, { kernel: vips.Kernel.linear }) : linearScRgb.copy();
      hdrPixels = smallHdr.writeToMemory();
    }
  }

  if (!hdrPixels && fullImage.format === 'ushort' && fullImage.bands >= 3 &&
    [ '.jxl', '.png' ].includes(extname(source).toLowerCase())) {
    using encodedRgb = fullImage.extractBand(0, { n: 3 });
    using lut = vips.Image.newFromMemory(getHdrTransferLut(18), 65536, 1, 1, vips.BandFormat.float);
    using sceneLinear = encodedRgb.maplut(lut);
    using linearRec2020 = hlgOotf(vips, sceneLinear);
    using matrix = vips.Image.newMatrix(3, 3, [
      1.660491, -0.587641, -0.072850,
      -0.124550, 1.132900, -0.008349,
      -0.018151, -0.100579, 1.118730
    ]);
    using linearScRgb = linearRec2020.recomb(matrix);
    using smallHdr = scale < 1 ? linearScRgb.resize(scale, { kernel: vips.Kernel.linear }) : linearScRgb.copy();
    hdrPixels = smallHdr.writeToMemory();
  }

  const isFloatHdr = hdrPixels !== null &&
    (hdrPixels instanceof Float32Array || hdrPixels instanceof Float64Array);
  const minimumLogNits = 0.1;
  const linear = {
    white: new Array<number>(128).fill(0),
    red: new Array<number>(128).fill(0),
    green: new Array<number>(128).fill(0),
    blue: new Array<number>(128).fill(0)
  };
  const logarithmic = {
    white: new Array<number>(128).fill(0),
    red: new Array<number>(128).fill(0),
    green: new Array<number>(128).fill(0),
    blue: new Array<number>(128).fill(0)
  };
  const luminance = (r: number, g: number, b: number) =>
    Math.max(0, 0.2126 * r + 0.7152 * g + 0.0722 * b);
  const srgbToLinear = (value: number) => {
    const encoded = Math.max(0, Math.min(1, value));
    return encoded <= 0.04045 ? encoded / 12.92 : Math.pow((encoded + 0.055) / 1.055, 2.4);
  };
  let actualMaximumNits = 0;
  const samples: Array<{ white: number; red: number; green: number; blue: number }> = [];

  for (let index = 0; index < pixelCount; index++) {
    const offset = index * 3;
    let redNits: number;
    let greenNits: number;
    let blueNits: number;

    if (isFloatHdr && hdrPixels && offset + 2 < hdrPixels.length) {
      // Ultra HDR, PQ and HLG decoders above provide linear scRGB values (1.0 = 80 cd/m²).
      redNits = Math.max(0, Number(hdrPixels[offset]) * 80);
      greenNits = Math.max(0, Number(hdrPixels[offset + 1]) * 80);
      blueNits = Math.max(0, Number(hdrPixels[offset + 2]) * 80);
    } else {
      // Interpret ordinary SDR code values as sRGB with reference white at 100 cd/m².
      redNits = srgbToLinear(Number(sdrPixels[offset]) / sdrMax) * 100;
      greenNits = srgbToLinear(Number(sdrPixels[offset + 1]) / sdrMax) * 100;
      blueNits = srgbToLinear(Number(sdrPixels[offset + 2]) / sdrMax) * 100;
    }

    const whiteNits = luminance(redNits, greenNits, blueNits);
    actualMaximumNits = Math.max(actualMaximumNits, whiteNits, redNits, greenNits, blueNits);
    samples.push({ white: whiteNits, red: redNits, green: greenNits, blue: blueNits });
  }

  // Derive the range from this image, not a fixed 10,000 cd/m² ceiling.
  const maximumNits = Math.max(minimumLogNits * 1.01, actualMaximumNits * 1.02);
  const linearBin = (nits: number) =>
    Math.min(127, Math.max(0, Math.floor(nits / maximumNits * 128)));
  const logarithmicBin = (nits: number) =>
    Math.min(127, Math.max(0, Math.floor(
      Math.log(Math.max(minimumLogNits, nits) / minimumLogNits) /
      Math.log(maximumNits / minimumLogNits) * 128
    )));

  for (const sample of samples) {
    for (const channel of [ 'white', 'red', 'green', 'blue' ] as const) {
      linear[channel][linearBin(sample[channel])]++;
      logarithmic[channel][logarithmicBin(sample[channel])]++;
    }
  }

  return { linear, logarithmic, maximumNits, minimumLogNits };
}

// Pre-initialize Vips in worker
getVips().catch(err => {
  console.error('[ThumbWorker] Failed to initialize Vips:', err);
});

function cancelRequest(id: string) {
  parentPort?.postMessage(
    {
      id,
      success: false,
      error: 'Cancelled'
    } satisfies ThumbWorkerResponse
  );
}

if (parentPort) {
  parentPort.on('message', async (request: ThumbWorkerRequest) => {
    if (request.type === 'cancel') {
      cancelledRequests.add(request.id);
      return;
    }

    if (request.type === 'histogram') {
      try {
        const histogram = histogramForImage(await getVips(), request.source);
        parentPort?.postMessage({ id: request.id, success: true, histogram } satisfies ThumbWorkerResponse);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        parentPort?.postMessage({ id: request.id, success: false, error: errorMessage } satisfies ThumbWorkerResponse);
      }
      return;
    }

    const { id, source, target, width, height } = request;

    console.log(`[ThumbWorker] Processing ${source}...`);

    try {
      if (cancelledRequests.has(id)) {
        cancelRequest(id);
        return;
      }

      try {
        await stat(target);
        parentPort?.postMessage({ id, success: false } satisfies ThumbWorkerResponse);

        return;
      } catch (_) {
        // Target does not exist, proceed to create thumbnail
      }

      if (cancelledRequests.has(id)) {
        cancelRequest(id);
        return;
      }

      const vips = await getVips();

      if (cancelledRequests.has(id)) {
        cancelRequest(id);
        return;
      }

      const sourceExtension = extname(source).toLowerCase();

      if (sourceExtension === '.exr') {
        const decoder = await getExrDecoder();
        const decoded = decoder.decodeRgbExr(await readFile(source));

        if (decoded.interleavedRgbPixels.length !== decoded.width * decoded.height * 3) {
          throw new Error('The EXR image does not contain standard RGB channels.');
        }

        using image = vips.Image.newFromMemory(
          decoded.interleavedRgbPixels,
          decoded.width,
          decoded.height,
          3,
          vips.BandFormat.float
        );

        if (width > 0 && height > 0) {
          const scale = Math.max(width / image.width, height / image.height) + 0.0001;
          using resized = image.resize(scale, { kernel: vips.Kernel.linear });
          using cropped = resized.extractArea(
            Math.max(0, Math.floor((resized.width - width) / 2)),
            Math.max(0, Math.floor((resized.height - height) / 2)),
            width,
            height
          );
          using scrgb = cropped.copy({ interpretation: vips.Interpretation.scrgb });
          scrgb.jpegsave(target, { Q: 80 });
        } else {
          using scrgb = image.copy({ interpretation: vips.Interpretation.scrgb });
          scrgb.jpegsave(target, { Q: 90 });
        }
      } else if (sourceExtension === '.hdr') {
        using encodedHdr = vips.Image.newFromFile(source);
        using linearHdr = encodedHdr.rad2float();

        if (width > 0 && height > 0) {
          const scale = Math.max(width / linearHdr.width, height / linearHdr.height) + 0.0001;
          using resized = linearHdr.resize(scale, { kernel: vips.Kernel.linear });
          using cropped = resized.extractArea(
            Math.max(0, Math.floor((resized.width - width) / 2)),
            Math.max(0, Math.floor((resized.height - height) / 2)),
            width,
            height
          );
          using scrgb = cropped.copy({ interpretation: vips.Interpretation.scrgb });
          scrgb.jpegsave(target, { Q: 80 });
        } else {
          using scrgb = linearHdr.copy({ interpretation: vips.Interpretation.scrgb });
          scrgb.jpegsave(target, { Q: 90 });
        }
      } else if ([ '.tif', '.tiff' ].includes(sourceExtension)) {
        using sourceImage = vips.Image.newFromFile(source, { access: 'sequential' });

        // Untagged 16-bit TIFF samples from FFmpeg use Rec. 2020 HLG codes.
        // Floating-point TIFFs are already linear and are treated as scRGB.
        if ([ 'float', 'double' ].includes(sourceImage.format) && sourceImage.bands >= 3) {
          using linearScRgb = sourceImage.extractBand(0, { n: 3 })
            .cast(vips.BandFormat.float)
            .copy({ interpretation: vips.Interpretation.scrgb });

          if (width > 0 && height > 0) {
            const scale = Math.max(width / linearScRgb.width, height / linearScRgb.height) + 0.0001;
            using resized = linearScRgb.resize(scale, { kernel: vips.Kernel.linear });
            using cropped = resized.extractArea(
              Math.max(0, Math.floor((resized.width - width) / 2)),
              Math.max(0, Math.floor((resized.height - height) / 2)),
              width,
              height
            );
            using scrgb = cropped.copy({ interpretation: vips.Interpretation.scrgb });
            scrgb.uhdrsave(target, { Q: 90 });
          } else {
            linearScRgb.uhdrsave(target, { Q: 90 });
          }
        } else if (sourceImage.format === 'ushort' && sourceImage.bands >= 3) {
          using rgb = sourceImage.extractBand(0, { n: 3 });
          using lutImage = vips.Image.newFromMemory(
            getHdrTransferLut(18),
            65536,
            1,
            1,
            vips.BandFormat.float
          );
          using linearRec2020 = rgb.maplut(lutImage);
          using displayRec2020 = hlgOotf(vips, linearRec2020);
          using rec2020ToScRgb = vips.Image.newMatrix(
            3,
            3,
            [
              1.660491, -0.587641, -0.072850,
              -0.124550, 1.132900, -0.008349,
              -0.018151, -0.100579, 1.118730
            ]
          );
          using image = displayRec2020.recomb(rec2020ToScRgb);

          if (width > 0 && height > 0) {
            const scale = Math.max(width / image.width, height / image.height) + 0.0001;
            using resized = image.resize(scale, { kernel: vips.Kernel.linear });
            using cropped = resized.extractArea(
              Math.max(0, Math.floor((resized.width - width) / 2)),
              Math.max(0, Math.floor((resized.height - height) / 2)),
              width,
              height
            );
            using scrgb = cropped.copy({ interpretation: vips.Interpretation.scrgb });
            scrgb.uhdrsave(target, { Q: 90 });
          } else {
            using scrgb = image.copy({ interpretation: vips.Interpretation.scrgb });
            scrgb.uhdrsave(target, { Q: 90 });
          }
        } else if (width > 0 && height > 0) {
          using thumb = vips.Image.thumbnail(source, width, { height, size: 2, crop: 1 });
          using jpeg = thumb.cast(vips.BandFormat.uchar).copy({ interpretation: vips.Interpretation.srgb });
          jpeg.jpegsave(target, { Q: 80 });
        } else {
          using jpeg = sourceImage.cast(vips.BandFormat.uchar).copy({ interpretation: vips.Interpretation.srgb });
          jpeg.jpegsave(target, { Q: 90 });
        }
      } else if (sourceExtension === '.heif' || sourceExtension === '.heic') {
        const heifData = await readFile(source);
        const profile = getHeifColorProfile(heifData);

        if (profile?.primaries === 9 && (profile.transfer === 16 || profile.transfer === 18)) {
          using hdrSource = decodeHeifHdrToVips(vips, heifData);
          const lut = getHdrTransferLut(profile.transfer);

          if (hdrSource.format !== 'ushort' || hdrSource.bands < 3) {
            throw new Error(`Unsupported HDR HEIF pixel format: ${hdrSource.format}/${hdrSource.bands}.`);
          }

          using lutImage = vips.Image.newFromMemory(lut, lut.length, 1, 1, vips.BandFormat.float);
          using linearRec2020 = hdrSource.maplut(lutImage);
          using displayRec2020 = profile.transfer === 18
            ? hlgOotf(vips, linearRec2020)
            : linearRec2020.copy();
          using rec2020ToScRgb = vips.Image.newMatrix(
            3,
            3,
            [
              1.660491, -0.587641, -0.072850,
              -0.124550, 1.132900, -0.008349,
              -0.018151, -0.100579, 1.118730
            ]
          );
          using image = displayRec2020.recomb(rec2020ToScRgb);

          if (width > 0 && height > 0) {
            const scale = Math.max(width / image.width, height / image.height) + 0.0001;
            using resized = image.resize(scale, { kernel: vips.Kernel.linear });
            using cropped = resized.extractArea(
              Math.max(0, Math.floor((resized.width - width) / 2)),
              Math.max(0, Math.floor((resized.height - height) / 2)),
              width,
              height
            );
            using scrgb = cropped.copy({ interpretation: vips.Interpretation.scrgb });
            scrgb.jpegsave(target, { Q: 80 });
          } else {
            using scrgb = image.copy({ interpretation: vips.Interpretation.scrgb });
            scrgb.jpegsave(target, { Q: 90 });
          }
        } else {
          const rgba = await decodeHeifToRgba(heifData);
          using decodedImage = vips.Image.newFromMemory(
            new Uint8Array(rgba.data.buffer, rgba.data.byteOffset, rgba.data.byteLength),
            rgba.width,
            rgba.height,
            4,
            vips.BandFormat.uchar
          );
          using rgb = decodedImage.extractBand(0, { n: 3 }).copy({ interpretation: vips.Interpretation.srgb });

          if (width > 0 && height > 0) {
            const scale = Math.max(width / rgb.width, height / rgb.height) + 0.0001;
            using resized = rgb.resize(scale, { kernel: vips.Kernel.lanczos3 });
            using cropped = resized.extractArea(
              Math.max(0, Math.floor((resized.width - width) / 2)),
              Math.max(0, Math.floor((resized.height - height) / 2)),
              width,
              height
            );
            cropped.jpegsave(target, { Q: 80 });
          } else {
            rgb.jpegsave(target, { Q: 90 });
          }
        }
      } else if (sourceExtension === '.avif') {
        const heifData = await readFile(source);
        const profile = getHeifColorProfile(heifData);

        if (profile?.primaries === 9 && (profile.transfer === 16 || profile.transfer === 18)) {
          using hdrSource = vips.Image.heifload(source, { unlimited: true });
          const lut = getHdrTransferLut(profile.transfer);

          if (hdrSource.format !== 'ushort' || hdrSource.bands < 3) {
            throw new Error(`Unsupported HDR HEIF/AVIF pixel format: ${hdrSource.format}/${hdrSource.bands}.`);
          }

          using lutImage = vips.Image.newFromMemory(
            lut,
            lut.length,
            1,
            1,
            vips.BandFormat.float
          );
          using linearRec2020 = hdrSource.maplut(lutImage);
          using displayRec2020 = profile.transfer === 18
            ? hlgOotf(vips, linearRec2020)
            : linearRec2020.copy();
          using rec2020ToScRgb = vips.Image.newMatrix(
            3,
            3,
            [
              1.660491, -0.587641, -0.072850,
              -0.124550, 1.132900, -0.008349,
              -0.018151, -0.100579, 1.118730
            ]
          );
          using image = displayRec2020.recomb(rec2020ToScRgb);

          if (width > 0 && height > 0) {
            const scale = Math.max(width / image.width, height / image.height) + 0.0001;
            using resized = image.resize(scale, { kernel: vips.Kernel.linear });
            using cropped = resized.extractArea(
              Math.max(0, Math.floor((resized.width - width) / 2)),
              Math.max(0, Math.floor((resized.height - height) / 2)),
              width,
              height
            );
            using scrgb = cropped.copy({ interpretation: vips.Interpretation.scrgb });
            scrgb.jpegsave(target, { Q: 80 });
          } else {
            using scrgb = image.copy({ interpretation: vips.Interpretation.scrgb });
            scrgb.jpegsave(target, { Q: 90 });
          }
        } else {
          if (width > 0 && height > 0) {
            using thumb = vips.Image.thumbnail(
              source,
              width,
              { height, size: 2, crop: 1 }
            );

            thumb.writeToFile(target, { Q: 80 });
          } else {
            using image = vips.Image.newFromFile(source, { access: 'sequential' });
            using rgb = image.extractBand(0, { n: Math.min(3, image.bands) })
              .cast(vips.BandFormat.uchar)
              .copy({ interpretation: vips.Interpretation.srgb });
            rgb.jpegsave(target, { Q: 90 });
          }
        }
      } else if (extname(source).toLowerCase() === '.jxr') {
        const [vips, jpegxr] = await Promise.all([ getVips(), getJpegXr() ]);
        const decoded = jpegxr.decode(await readFile(source));

        const { bitDepth, channels, bgr } = decoded.pixelInfo;
        let pixels: Uint8Array | Uint16Array | Float32Array;
        let format: typeof vips.BandFormat.uchar | typeof vips.BandFormat.ushort | typeof vips.BandFormat.float;

        if (bitDepth === '32Float') {
          format = vips.BandFormat.float;
          pixels = new Float32Array(
            decoded.bytes.buffer.slice(decoded.bytes.byteOffset, decoded.bytes.byteOffset + decoded.bytes.byteLength)
          );
        } else if (bitDepth === '16Float') {
          const halfPixels = new Uint16Array(
            decoded.bytes.buffer.slice(decoded.bytes.byteOffset, decoded.bytes.byteOffset + decoded.bytes.byteLength)
          );
          const floatPixels = new Float32Array(halfPixels.length);

          for (let index = 0; index < halfPixels.length; index++) {
            floatPixels[index] = halfFloatToFloat(halfPixels[index]);
          }

          format = vips.BandFormat.float;
          pixels = floatPixels;
        } else if (bitDepth === '16') {
          format = vips.BandFormat.ushort;
          pixels = new Uint16Array(
            decoded.bytes.buffer.slice(decoded.bytes.byteOffset, decoded.bytes.byteOffset + decoded.bytes.byteLength)
          );
        } else if (bitDepth === '8') {
          format = vips.BandFormat.uchar;
          pixels = decoded.bytes;
        } else {
          throw new Error(`Unsupported JPEG XR pixel format: ${decoded.pixelInfo.bitDepth}.`);
        }

        if (channels < 1 || channels === 2) {
          throw new Error(`Unsupported JPEG XR channel count: ${channels}.`);
        }

        using sourceImage = vips.Image.newFromMemory(
          pixels,
          decoded.width,
          decoded.height,
          channels,
          format
        );
        using convertedImage = sourceImage.cast(vips.BandFormat.float);
        using floatImage = convertedImage.linear([
          bitDepth.endsWith('Float') ? 1 : 1 / (bitDepth === '8' ? 255 : 65535)
        ], [ 0 ]);
        using orderedRgb = channels === 1
          ? vips.Image.bandjoin([
            floatImage.extractBand(0),
            floatImage.extractBand(0),
            floatImage.extractBand(0)
          ])
          : bgr
            ? vips.Image.bandjoin([
              floatImage.extractBand(2),
              floatImage.extractBand(1),
              floatImage.extractBand(0)
            ])
            : floatImage.extractBand(0, { n: 3 });

        if (width > 0 && height > 0) {
          const scale = Math.max(width / decoded.width, height / decoded.height) + 0.0001;
          using resized = orderedRgb.resize(scale, { kernel: vips.Kernel.linear });
          using cropped = resized.extractArea(
            Math.max(0, Math.floor((resized.width - width) / 2)),
            Math.max(0, Math.floor((resized.height - height) / 2)),
            width,
            height
          );
          using scrgb = cropped.copy({ interpretation: vips.Interpretation.scrgb });
          scrgb.jpegsave(target, { Q: 80 });
        } else {
          using scrgb = orderedRgb.copy({ interpretation: vips.Interpretation.scrgb });
          scrgb.jpegsave(target, { Q: 90 });
        }
      } else {
        using thumb = vips.Image.thumbnail(
          source,
          width,
          {
            height,
            size: 2,
            crop: 1
          }
        );

        if (cancelledRequests.has(id)) {
          cancelRequest(id);
          return;
        }

        thumb.writeToFile(target, { Q: 80 });
      }

      parentPort?.postMessage({ id, success: true } satisfies ThumbWorkerResponse);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error(`[ThumbWorker] Thumbnail generation error (${source}):`, errorMessage);
      parentPort?.postMessage(
        {
          id,
          success: false,
          error: errorMessage
        } satisfies ThumbWorkerResponse
      );
    } finally {
      cancelledRequests.delete(id);
    }
  });
}
