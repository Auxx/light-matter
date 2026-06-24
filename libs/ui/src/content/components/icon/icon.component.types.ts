export const allThicknesses = [ 'medium', 'thin' ] as const;

export type Thickness = typeof allThicknesses[number];
