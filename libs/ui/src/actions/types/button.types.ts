export const allButtonTypes = [ 'button', 'submit', 'reset' ] as const;

export type ButtonType = typeof allButtonTypes[number];
