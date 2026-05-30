import { generateFiles, joinPathFragments, names, Tree } from '@nx/devkit';
import { getComponentClassSuffix, getComponentSuffix } from '../../lib/component-types/component-types';
import { componentPath, featurePath } from '../../lib/path-helper/path-helper';
import { ServiceGeneratorSchema } from './service-schema';

export async function serviceGenerator(tree: Tree, options: ServiceGeneratorSchema) {
  const feature = featurePath(tree, options.project, options.feature);
  if (!tree.exists(feature) || tree.isFile(feature)) {
    console.log(`Feature "${options.feature}" does not exist.`);
    return;
  }

  const targetPath = componentPath(tree, options.project, options.feature, options.name, 'service');
  const artifact = names(options.name);

  const entityName = artifact.className;
  const className = `${artifact.className}${getComponentClassSuffix('service')}`;
  const fileName = `${artifact.fileName}.${getComponentSuffix('service')}`;

  generateFiles(
    tree,
    joinPathFragments(__dirname, 'files'),
    targetPath,
    {
      entityName,
      className,
      fileName
    }
  );
}

export default serviceGenerator;
