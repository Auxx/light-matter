import { addProjectConfiguration, Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from 'nx/src/generators/testing-utils/create-tree-with-empty-workspace';
import componentGenerator from './component';

describe('Component Generator', () => {
  let tree: Tree;

  const appName = 'front-end';

  const featureName = 'user';

  const componentName = 'user-list';

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();

    addProjectConfiguration(
      tree,
      appName,
      {
        projectType: 'application',
        root: `apps/${appName}`,
        sourceRoot: `apps/${appName}/src`
      },
      true
    );
  });

  it('should create an Angular component', async () => {
    tree.write(`apps/${appName}/src/${featureName}/routes.ts`, '');

    await componentGenerator(tree, {
      name: componentName,
      project: appName,
      feature: featureName,
      type: 'component'
    });

    const targetPath = `apps/${appName}/src/${featureName}/components/${componentName}`;

    expect(tree.children(targetPath).length).toBe(4);
    expect(tree.exists(`${targetPath}/${componentName}.component.scss`)).toBe(true);
    expect(tree.exists(`${targetPath}/${componentName}.component.html`)).toBe(true);
    expect(tree.exists(`${targetPath}/${componentName}.component.spec.ts`)).toBe(true);
    expect(tree.exists(`${targetPath}/${componentName}.component.ts`)).toBe(true);
  });

  it('should fail is feature does not exist', async () => {
    await componentGenerator(tree, {
      name: componentName,
      project: appName,
      feature: featureName,
      type: 'component'
    });

    const targetPath = `apps/${appName}/src/${featureName}/components/${componentName}`;

    expect(tree.children(targetPath).length).toBe(0);
  });
});
