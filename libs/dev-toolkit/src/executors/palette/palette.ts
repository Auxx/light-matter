import { ExecutorContext } from '@nx/devkit';
import * as fs from 'node:fs';
import { OKLCH, PaletteConfig, PaletteConfigColorSection, PaletteExecutorSchema } from './palette.schema';

export async function paletteExecutor(options: PaletteExecutorSchema, _context: ExecutorContext) {
  const config: PaletteConfig = JSON.parse(fs.readFileSync(options.config, { encoding: 'utf8' }));

  const result = serialise(
    join([
      [ '/* Surfaces */' ],
      generateColorSection('surface', config.surfaces),
      [ '/* Content on surfaces */' ],
      generateColorSection('content', config.content),
      [ '/* Elements */' ],
      generateColorSection('element', config.element),
      [ '/* Contrast on elements */' ],
      generateColorSection('contrast', config.contrast)
    ])
  );

  fs.writeFileSync(options.target, result, { encoding: 'utf8' });

  return {
    success: true
  };
}

function serialise(rules: string[]): string {
  return `:root {\n${rules.map(rule => `  ${rule}`).join('\n')}\n}`;
}

function generateColorSection(sectionName: string, surfaces: PaletteConfigColorSection) {
  const heights = surfaces.inverse ? surfaces.heights.reverse() : surfaces.heights;

  const result = join(
    Object.entries(surfaces.colors)
      .map(([ colorName, color ]) => generateSurfaceColor(sectionName, colorName, heights, color, surfaces.stepping))
  );

  return result;
}

function join(arrays: string[][]): string[] {
  return arrays
    .flatMap((value, index) => index === 0 ? [ value ] : [ [ '' ], value ])
    .flat();
}

function generateSurfaceColor(
  sectionName: string,
  colorName: string,
  heights: string[],
  color: OKLCH,
  stepping: OKLCH
): string[] {
  return heights.map((height, index) =>
    cssVar(
      oklch({
        luma: color.luma + stepping.luma * index,
        chroma: color.chroma + stepping.chroma * index,
        hue: color.hue + stepping.hue * index
      }),
      'color',
      sectionName,
      colorName,
      height
    )
  );
}

function cssVar<T>(value: T, ...segments: string[]): string {
  return `--${segments.join('-')}: ${value};`;
}

function oklch(value: OKLCH): string {
  return `oklch(${value.luma.toFixed(3)} ${value.chroma.toFixed(3)} ${value.hue.toFixed(3)})`;
}

export default paletteExecutor;
