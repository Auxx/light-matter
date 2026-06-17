import { appPaths, appProtocol } from 'internal-api';

export function imageUrl(selectedFile: string): string {
  const result = new URL(`${appProtocol}://app`);

  result.pathname = appPaths.raw;
  result.searchParams.set('image', selectedFile);

  return result.toString();
}

export function thumbUrl(selectedFile: string, width: number, height: number): string {
  const result = new URL(`${appProtocol}://app`);

  result.pathname = appPaths.thumbs;
  result.searchParams.set('image', selectedFile);
  result.searchParams.set('width', width.toString());
  result.searchParams.set('height', height.toString());

  return result.toString();
}
