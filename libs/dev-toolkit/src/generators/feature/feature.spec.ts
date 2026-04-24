import { addProjectConfiguration, Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from 'nx/src/generators/testing-utils/create-tree-with-empty-workspace';
import { featureGenerator } from './feature';

describe('Feature Generator', () => {
  let tree: Tree;

  const appName = 'my-app';

  const featureName = 'new-feature';

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

  it('should generate a new feature inside project', async () => {
    const routes = `apps/${appName}/src/${featureName}/${featureName}.routes.ts`;

    await featureGenerator(tree, { name: featureName, project: appName });

    expect(tree.exists(routes)).toBe(true);
    expect(tree.isFile(routes)).toBe(true);
    expect(tree.read(routes)?.toString().replaceAll('\r', '').replaceAll('\n', ''))
      .toBe('import { Route } from \'@angular/router\';export const routes: Route[] = [];');
  });

  it('should not overwrite existing feature', async () => {
    const routes = `apps/${appName}/src/${featureName}/${featureName}.routes.ts`;
    tree.write(routes, '');

    await featureGenerator(tree, { name: featureName, project: appName });

    expect(tree.read(routes)?.toString()).toBe('');
  });
});
