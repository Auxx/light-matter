import { addProjectConfiguration, Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from 'nx/src/generators/testing-utils/create-tree-with-empty-workspace';
import { Project, SourceFile, SyntaxKind, VariableDeclaration } from 'ts-morph';
import { modifyVariable, morph, variable } from './code-morph';

describe('Code Morph', () => {
  let tree: Tree;

  const appName = 'front-end';

  const fileName = `apps/${appName}/src/example.ts`;

  beforeEach(async () => {
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

  describe('morph', () => {
    it('should initialise state correctly', () => {
      tree.write(fileName, 'export const example = "example";');
      const state = morph(tree, fileName).state();

      expect(state.fullPath).toBe(fileName);
      expect(state.fileName).toBe('example.ts');
      expect(state.project).toBeInstanceOf(Project);
      expect(state.sourceFile).toBeInstanceOf(SourceFile);
    });
  });

  describe('variable', () => {
    it('should return an export variable declaration', () => {
      tree.write(fileName, 'export const example = "example";');

      const state = morph(tree, fileName, variable('example')).state();

      expect(state.withResult).toBe(true);
      expect(state.withResult ? state.result : undefined).toBeInstanceOf(VariableDeclaration);
    });

    it('should return an export variable declaration of specific kind', () => {
      tree.write(fileName, 'export const example = "example";');

      const state = morph(tree, fileName, variable('example', SyntaxKind.StringLiteral)).state();

      expect(state.withResult).toBe(true);
      expect(state.withResult ? state.result : undefined).toBeInstanceOf(VariableDeclaration);
    });

    it('should return an internal variable declaration', () => {
      tree.write(fileName, 'const example = "example";');

      const state = morph(tree, fileName, variable('example')).state();

      expect(state.withResult).toBe(true);
      expect(state.withResult ? state.result : undefined).toBeInstanceOf(VariableDeclaration);
    });

    it('should signal when variable is not found', () => {
      tree.write(fileName, 'const example = "example";');

      const state = morph(tree, fileName, variable('myExample')).state();

      expect(state.withResult).toBe(false);
    });
  });

  describe('modifyVariable', () => {
    it('should modify a string variable declaration', () => {
      tree.write(fileName, 'const example = "example";');

      const code = morph(
        tree,
        fileName,
        variable('example', SyntaxKind.StringLiteral),
        modifyVariable(decl => decl.setInitializer('"123"'))
      )
        .toString();

      expect(code).toBe('const example = "123";');
    });

    it('should modify an array variable declaration', () => {
      tree.write(fileName, 'const example = [1, 2, 3];');

      const code = morph(
        tree,
        fileName,
        variable('example', SyntaxKind.ArrayLiteralExpression),
        modifyVariable(decl => decl.getInitializerIfKindOrThrow(SyntaxKind.ArrayLiteralExpression).addElement('5'))
      )
        .toString();

      expect(code).toBe('const example = [1, 2, 3, 5];');
    });
  });
});
