import { AngularProjectConfiguration } from '@nx/angular/internal';
import { generateFiles, joinPathFragments, names, readProjectConfiguration, Tree } from '@nx/devkit';
import {
  defaultComponentPrefix,
  getComponentClassSuffix,
  getComponentSuffix
} from '../../lib/component-types/component-types';
import { componentPath, featurePath } from '../../lib/path-helper/path-helper';
import { ComponentGeneratorSchema } from './component-schema';

interface LastRun {
  success: boolean;
  className: string;
  fileName: string;
  selector: string;
}

const lastRun: LastRun = {
  success: true,
  className: '',
  fileName: '',
  selector: ''
};

export async function componentGenerator(tree: Tree, options: ComponentGeneratorSchema) {
  const feature = featurePath(tree, options.project, options.feature);
  if (!tree.exists(feature) || tree.isFile(feature)) {
    console.log(`Feature "${options.feature}" does not exist.`);
    lastRun.success = false;
    return;
  }

  const targetPath = componentPath(tree, options.project, options.feature, options.name, options.type);
  const artifact = names(options.name);

  const entityName = artifact.className;
  const className = `${artifact.className}${getComponentClassSuffix(options.type)}`;
  const fileName = `${artifact.fileName}.${getComponentSuffix(options.type)}`;
  const selector = createSelector(tree, options, options.name);

  generateFiles(
    tree,
    joinPathFragments(__dirname, 'files'),
    targetPath,
    {
      entityName,
      className,
      fileName,
      selector
    }
  );

  lastRun.success = true;
  lastRun.className = className;
  lastRun.fileName = fileName;
  lastRun.selector = selector;
}

function createSelector(tree: Tree, options: ComponentGeneratorSchema, name: string): string {
  const project = readProjectConfiguration(tree, options.project);
  const prefix = (project as AngularProjectConfiguration).prefix ?? defaultComponentPrefix;

  return names(`${prefix}-${name}`).fileName;
}

export function getLastRun(): LastRun {
  return lastRun;
}

export default componentGenerator;
