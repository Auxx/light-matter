import { ExifTags } from 'internal-api';

export type ImageDynamicRange = 'HDR' | 'SDR';

export interface ImageDynamicRangeDiagnostics {
  result: ImageDynamicRange;
  extension: string;
  bitDepth: number | null;
  rule: string;
  matchedMarkers: string[];
}

const HDR_MARKERS: Array<{ label: string; pattern: RegExp }> = [
  { label: 'gain map', pattern: /gain.?map/i },
  { label: 'HDRGM', pattern: /hdr.?gm/i },
  { label: 'JPEG-R', pattern: /jpegr/i },
  { label: 'HDR image/capacity', pattern: /hdrimage|hdr.?capacity/i },
  { label: 'ISO 21496', pattern: /iso.?21496/i },
  { label: 'SMPTE 2084 / PQ', pattern: /smpte.?2084|st.?2084|\bpq\b/i },
  { label: 'HLG', pattern: /\bhlg\b/i },
  { label: 'ARIB', pattern: /arib/i }
];

const flattenMetadata = (value: unknown): string => {
  if (value === null || value === undefined) {
    return '';
  }
  if (Array.isArray(value)) {
    return value.map(flattenMetadata).join(' ');
  }
  if (typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>)
      .map(([ key, nested ]) => `${key} ${flattenMetadata(nested)}`)
      .join(' ');
  }
  return String(value);
};

export function imageDynamicRangeDiagnostics(
  path: string,
  tags: ExifTags | null,
  bitDepth: string | null
): ImageDynamicRangeDiagnostics {
  const extension = path.split('.').pop()?.toLowerCase() ?? '';
  const rawDepth = tags?.BitsPerSample ?? tags?.BitDepth ?? bitDepth ?? '';
  const parsedDepth = Number.parseInt(String(rawDepth), 10);
  const depth = Number.isFinite(parsedDepth) ? parsedDepth : null;
  const metadata = flattenMetadata(tags).toLowerCase();
  const matchedMarkers = HDR_MARKERS.filter(marker => marker.pattern.test(metadata)).map(marker => marker.label);

  if ([ 'exr', 'hdr', 'jxr', 'jxl' ].includes(extension)) {
    return { result: 'HDR', extension, bitDepth: depth, rule: `File extension .${extension} is treated as HDR`, matchedMarkers };
  }

  if (matchedMarkers.length > 0) {
    return { result: 'HDR', extension, bitDepth: depth, rule: `HDR metadata marker(s): ${matchedMarkers.join(', ')}`, matchedMarkers };
  }

  if ([ 'avif', 'heif', 'heic', 'png', 'tif', 'tiff' ].includes(extension) && depth !== null && depth >= 10) {
    return { result: 'HDR', extension, bitDepth: depth, rule: `Bit depth ${depth} is at least 10-bit for .${extension}`, matchedMarkers };
  }

  let rule = 'No HDR marker matched; default classification is SDR';
  if ([ 'avif', 'heif', 'heic', 'png', 'tif', 'tiff' ].includes(extension) && depth !== null) {
    rule = `No HDR marker matched; ${depth}-bit depth does not meet the 10-bit rule for .${extension}`;
  }
  return { result: 'SDR', extension, bitDepth: depth, rule, matchedMarkers };
}

export function imageDynamicRange(path: string, tags: ExifTags | null, bitDepth: string | null): ImageDynamicRange {
  return imageDynamicRangeDiagnostics(path, tags, bitDepth).result;
}
