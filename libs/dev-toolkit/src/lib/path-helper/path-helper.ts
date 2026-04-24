import { joinPathFragments, readProjectConfiguration, Tree } from '@nx/devkit';
import { ComponentType, getComponentFolder } from '../component-types/component-types';

export function projectPath(tree: Tree, projectName: string): string {
  return readProjectConfiguration(tree, projectName).root;
}

export function projectSrcPath(tree: Tree, projectName: string): string {
  const result = readProjectConfiguration(tree, projectName).sourceRoot;

  if (result === undefined) {
    throw new Error(`No source folder for "${projectName}"`);
  }

  return result;
}

export function featurePath(tree: Tree, projectName: string, featureName: string): string {
  return joinPathFragments(projectSrcPath(tree, projectName), featureName);
}

export function componentContainerPath(
  tree: Tree,
  projectName: string,
  featureName: string,
  type: ComponentType = 'component'
): string {
  return joinPathFragments(
    featurePath(tree, projectName, featureName),
    getComponentFolder(type)
  );
}

export function componentPath(
  tree: Tree,
  projectName: string,
  featureName: string,
  componentName: string,
  type: ComponentType = 'component'
): string {
  return joinPathFragments(
    componentContainerPath(tree, projectName, featureName, type),
    componentName
  );
}

export function featureRoutesPath(tree: Tree, projectName: string, featureName: string): string {
  return joinPathFragments(featurePath(tree, projectName, featureName), `${featureName}.routes.ts`);
}
