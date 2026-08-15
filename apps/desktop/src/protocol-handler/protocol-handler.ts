import { appPaths } from 'internal-api';
import { createReadStream, existsSync } from 'node:fs';
import { extname } from 'node:path';
import { Readable } from 'node:stream';
import * as url from 'node:url';
import { Injector } from '../injector/injector';

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.jxl': 'image/jxl',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.bmp': 'image/bmp'
};

export const getMimeType = (filePath: string): string => {
  const ext = extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
};

export const streamFile = (filePath: string): GlobalResponse => {
  if (!existsSync(filePath)) {
    return notFound();
  }

  try {
    const mimeType = getMimeType(filePath);
    const nodeStream = createReadStream(filePath);
    const webStream = Readable.toWeb(nodeStream) as unknown as ReadableStream;

    return new Response(webStream, {
      status: 200,
      headers: {
        'Content-Type': mimeType
      }
    });
  } catch (err) {
    console.error(`[protocolHandler] Failed to stream file ${filePath}:`, err);
    return notFound();
  }
};

export const protocolHandler = async (request: GlobalRequest): Promise<GlobalResponse> => {
  const parsed = new url.URL(request.url);

  switch (parsed.pathname) {
    case appPaths.thumbs:
      console.log('request.signal', request.signal);
      return await thumb(parsed.searchParams, request.signal);

    case appPaths.raw:
      return await raw(parsed.searchParams);

    default:
      return notFound();
  }
};

const thumb = async (params: URLSearchParams, signal?: AbortSignal): Promise<GlobalResponse> => {
  const fileName = params.get('image');
  const width = Number(params.get('width'));
  const height = Number(params.get('height'));

  if (fileName === null || signal?.aborted) {
    return notFound();
  }

  try {
    const tag = `${width}x${height}`;
    const injector = Injector.getInstance();
    const cacheManager = injector.inject('CacheManager');
    const thumbManager = injector.inject('ThumbManager');

    const result = await cacheManager.get(
      fileName,
      tag,
      async target => {
        if (signal?.aborted) {
          return false;
        }

        return await thumbManager.generate(
          fileName,
          target,
          width,
          height,
          signal
        );
      }
    );

    if (signal?.aborted) {
      return notFound();
    }

    const filePath = result === null ? fileName : result;
    return streamFile(filePath);
  } catch (_error) {
    console.error(_error);
    return notFound();
  }
};

const raw = async (params: URLSearchParams): Promise<GlobalResponse> => {
  const fileName = params.get('image');

  if (fileName === null) {
    return notFound();
  }

  try {
    return streamFile(fileName);
  } catch (_error) {
    console.error(_error);
    return notFound();
  }
};

const notFound = () => new Response('Not found', { status: 404 });
