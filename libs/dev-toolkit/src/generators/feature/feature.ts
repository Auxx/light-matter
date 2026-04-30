import { generateFiles, joinPathFragments, names, Tree } from '@nx/devkit';
import { featurePath } from '../../lib/path-helper/path-helper';
import { FeatureGeneratorSchema } from './feature-schema';

export async function featureGenerator(tree: Tree, options: FeatureGeneratorSchema) {
  const targetPath = featurePath(tree, options.project, options.name);

  if (tree.exists(targetPath) && !tree.isFile(targetPath)) {
    console.log(`Feature "${options.name}" already exists.`);
    return;
  }

  const { fileName } = names(options.name);

  generateFiles(
    tree,
    joinPathFragments(__dirname, 'files'),
    targetPath,
    { fileName }
  );
}

export default featureGenerator;
