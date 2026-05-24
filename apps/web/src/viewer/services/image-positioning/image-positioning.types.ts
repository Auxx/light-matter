export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ImageLocation {
  x: number;
  y: number;
}

export interface ImageOffset {
  dx: number;
  dy: number;
}

export type ImageZoom = 'fit' | number;

export interface ImagePositioningState {
  pixelRatio: number;
  zoom: ImageZoom;
  fitZoom: number;
}

export type ImagePositioningResult =
  & ImageDimensions
  & ImageLocation
  & ImagePositioningState;

export const defaultImagePositioningResult = (): ImagePositioningResult => ({
  width: 0,
  height: 0,
  x: 0,
  y: 0,
  pixelRatio: 1,
  zoom: 'fit',
  fitZoom: 1
});

export const defaultImageZoom = (): ImageZoom => 'fit';
