import { getComponentClassSuffix, getComponentFolder, getComponentSuffix } from './component-types';

describe('Component Types', () => {
  it('should have correct component folder', () => {
    expect(getComponentFolder('component')).toBe('components');
    expect(getComponentFolder('page')).toBe('pages');
  });

  it('should have correct component file suffix', () => {
    expect(getComponentSuffix('component')).toBe('component');
    expect(getComponentSuffix('page')).toBe('page');
  });

  it('should have correct component class suffix', () => {
    expect(getComponentClassSuffix('component')).toBe('Component');
    expect(getComponentClassSuffix('page')).toBe('Page');
  });
});
