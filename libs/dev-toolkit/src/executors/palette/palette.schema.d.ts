export interface PaletteExecutorSchema {
  config: string;
  target: string;
}

interface OKLCH {
  luma: number;
  chroma: number;
  hue: number;
}

export interface PaletteConfig {
  surfaces: PaletteConfigColorSection;
  content: PaletteConfigColorSection;
  element: PaletteConfigColorSection;
  contrast: PaletteConfigColorSection;
}

export interface PaletteConfigColorSection {
  heights: string[];
  colors: Record<string, OKLCH>;
  stepping: OKLCH;
  inverse: boolean;
}
