export function hasTouchSupport() {
  return 'ontouchstart' in window;
}
