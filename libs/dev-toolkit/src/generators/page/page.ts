import { joinPathFragments, Tree } from '@nx/devkit';
import { SyntaxKind } from 'ts-morph';
import { addImportDeclaration, modifyVariable, morph, variable } from '../../lib/code-morph/code-morph';
import { getComponentFolder } from '../../lib/component-types/component-types';
import { featureRoutesPath } from '../../lib/path-helper/path-helper';
import componentGenerator, { getLastRun } from '../component/component';
import { PageGeneratorSchema } from './page-schema';

export async function pageGenerator(tree: Tree, options: PageGeneratorSchema) {
  await componentGenerator(tree, { ...options, type: 'page' });

  const lastRun = getLastRun();

  if (lastRun.success) {
    const routesPath = featureRoutesPath(tree, options.project, options.feature);

    const state = morph(
      tree,
      routesPath,
      addImportDeclaration(
        [ lastRun.className ],
        './' + joinPathFragments(getComponentFolder('page'), options.name, lastRun.fileName)
      ),
      variable('routes', SyntaxKind.ArrayLiteralExpression),
      modifyVariable(decl =>
        decl
          .getInitializerIfKindOrThrow(SyntaxKind.ArrayLiteralExpression)
          .addElement(`{ path: '${options.name}', component: ${lastRun.className} }`)
      )
    );

    state.save();
  }
}

export default pageGenerator;
