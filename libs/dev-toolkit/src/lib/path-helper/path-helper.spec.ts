import { addProjectConfiguration, Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from 'nx/src/generators/testing-utils/create-tree-with-empty-workspace';
import {
  componentContainerPath,
  componentPath,
  featurePath,
  featureRoutesPath,
  projectPath,
  projectSrcPath
} from './path-helper';

describe('Path Helper', () => {
  let tree: Tree;

  const appName = 'my-app';
  const libName = 'my-lib';

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

    addProjectConfiguration(
      tree,
      libName,
      {
        projectType: 'application',
        root: `libs/${libName}`,
        sourceRoot: `libs/${libName}/src`
      },
      true
    );
  });

  describe('projectPath', () => {
    it.each`
    projectName | expectedPath
    ${appName}  | ${`apps/${appName}`}
    ${libName}  | ${`libs/${libName}`}
    `('should return path to project $projectName', ({ projectName, expectedPath }) => {
      expect(projectPath(tree, projectName)).toBe(expectedPath);
    });
  });

  describe('projectSrcPath', () => {
    it.each`
    projectName | expectedPath
    ${appName}  | ${`apps/${appName}/src`}
    ${libName}  | ${`libs/${libName}/src`}
    `('should return path to project source $projectName', ({ projectName, expectedPath }) => {
      expect(projectSrcPath(tree, projectName)).toBe(expectedPath);
    });
  });

  describe('featurePath', () => {
    it.each`
    projectName | featureName  | expectedPath
    ${appName}  | ${'app'}     | ${`apps/${appName}/src/app`}
    ${appName}  | ${'welcome'} | ${`apps/${appName}/src/welcome`}
    ${appName}  | ${'auth'}    | ${`apps/${appName}/src/auth`}
    ${libName}  | ${'layouts'} | ${`libs/${libName}/src/layouts`}
    ${libName}  | ${'dialogs'} | ${`libs/${libName}/src/dialogs`}
    `(
      'should return path to feature $featureName inside project $projectName',
      ({ projectName, featureName, expectedPath }) => {
        expect(featurePath(tree, projectName, featureName)).toBe(expectedPath);
      }
    );
  });

  describe('componentContainerPath', () => {
    it.each`
    projectName | featureName  | type           | expectedPath
    ${appName}  | ${'welcome'} | ${'component'} | ${`apps/${appName}/src/welcome/components`}
    ${appName}  | ${'auth'}    | ${'page'}      | ${`apps/${appName}/src/auth/pages`}
    `('should return path to a component container $type', ({ projectName, featureName, type, expectedPath }) => {
      expect(componentContainerPath(tree, projectName, featureName, type)).toBe(expectedPath);
    });
  });

  describe('componentPath', () => {
    it.each`
    projectName | featureName  | componentName  | type | expectedPath
    ${appName}  | ${'welcome'} | ${'user-info'} | ${'component'} | ${`apps/${appName}/src/welcome/components/user-info`}
    ${appName}  | ${'auth'}    | ${'reset'}     | ${'component'} | ${`apps/${appName}/src/auth/components/reset`}
    ${appName}  | ${'auth'}    | ${'back'}      | ${'page'} | ${`apps/${appName}/src/auth/pages/back`}
    `(
      'should return path to component $componentName of type $type',
      ({ projectName, featureName, componentName, type, expectedPath }) => {
        expect(componentPath(tree, projectName, featureName, componentName, type)).toBe(expectedPath);
      }
    );
  });

  describe('featureRoutesPath', () => {
    it('should return path to a feature routes file', () => {
      expect(featureRoutesPath(tree, appName, 'welcome')).toBe(`apps/${appName}/src/welcome/welcome.routes.ts`);
    });
  });
});
