export const allVariants = [ 'default', 'accent', 'warn' ] as const;

export type Variant = typeof allVariants[number];
