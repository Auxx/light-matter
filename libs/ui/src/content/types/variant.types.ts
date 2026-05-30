export const allVariants = [ 'default', 'primary', 'warn' ] as const;

export type Variant = typeof allVariants[number];
