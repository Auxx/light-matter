export const allAnimationStates = [ 'none', 'leave-left', 'enter-left', 'leave-right', 'enter-right' ] as const;
export type AnimationState = typeof allAnimationStates[number];
