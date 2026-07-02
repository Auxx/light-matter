import { net } from 'electron';
import { appPaths } from 'internal-api';
import { extname } from 'node:path';
import * as url from 'node:url';
import { Injector } from '../injector/injector';

export const protocolHandler = async (request: GlobalRequest): Promise<GlobalResponse> => {
  const parsed = new url.URL(request.url);

  switch (parsed.pathname) {
    case appPaths.thumbs:
      return await thumb(parsed.searchParams);

    case appPaths.raw:
      return await raw(parsed.searchParams);

    case appPaths.transcode:
      return await transcode(parsed.searchParams);

    default:
      return notFound();
  }
};

const thumb = async (params: URLSearchParams): Promise<GlobalResponse> => {
  const fileName = params.get('image');
  const width = Number(params.get('width'));
  const height = Number(params.get('height'));

  if (fileName === null) {
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
      null,
      async target => {
        return await thumbManager.generate(
          fileName,
          target,
          width,
          height
        );
      }
    );

    return net.fetch(
      url
        .pathToFileURL(result === null ? fileName : result)
        .toString()
    );
  } catch (_error) {
    console.log(_error);
    return notFound();
  }
};

const raw = async (params: URLSearchParams): Promise<GlobalResponse> => {
  const fileName = params.get('image');

  if (fileName === null) {
    return notFound();
  }

  const ext = extname(fileName);
  console.log(ext);

  try {
    return net.fetch(url.pathToFileURL(fileName).toString());
  } catch (_error) {
    console.log(_error);
    return notFound();
  }
};

const transcode = async (params: URLSearchParams): Promise<GlobalResponse> => {
  const injector = Injector.getInstance();
  const cacheManager = injector.inject('CacheManager');
  const transcoder = injector.inject('Transcoder');
  const fileName = params.get('image');

  if (fileName === null) {
    return notFound();
  }

  const result = await cacheManager.get(
    fileName,
    'transcode',
    '.jxl',
    async target => {
      return await transcoder.generate(
        fileName,
        target
      );
    }
  );

  return new Response(
    JSON.stringify({
      fileName,
      result
    }),
    { headers: { 'Content-Type': 'application/json; charset=UTF-8' } }
  );
};

const notFound = () => new Response('Not found', { status: 404 });
