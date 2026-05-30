export const allSizes = [ 'medium', 'small', 'large' ] as const;

export type Size = typeof allSizes[number];

export const allExtendedSizes = [ 'medium', 'x-small', 'small', 'large', 'x-large' ] as const;

export type ExtendedSize = typeof allExtendedSizes[number];
