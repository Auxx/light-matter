import { Tree } from '@nx/devkit';
import * as path from 'node:path';
import { Project, SourceFile, SyntaxKind, VariableDeclaration } from 'ts-morph';

export interface CodeMorphStateBase {
  tree: Tree;
  fullPath: string;
  fileName: string;
  project: Project;
  sourceFile: SourceFile;
}

export interface CodeMorphStateWithResult<T> extends CodeMorphStateBase {
  withResult: true;
  result: T;
}

export interface CodeMorphStateEmpty extends CodeMorphStateBase {
  withResult: false;
}

export type CodeMorphState<T> = CodeMorphStateWithResult<T> | CodeMorphStateEmpty;

export interface CodeMorphOperator<T, R> {
  (state: CodeMorphState<T>): CodeMorphState<R>;
}

export interface CodeMorphResult<T> {
  save: () => void;
  state: () => CodeMorphState<T>;
  toString: () => string;
}

export function morph<T>(tree: Tree, filePath: string): CodeMorphResult<T>;
export function morph<T, A>(
  tree: Tree,
  filePath: string,
  op1: CodeMorphOperator<CodeMorphState<T>, A>
): CodeMorphResult<A>;
export function morph<T, A, B>(
  tree: Tree,
  filePath: string,
  op1: CodeMorphOperator<CodeMorphState<T>, A>,
  op2: CodeMorphOperator<A, B>
): CodeMorphResult<B>;
export function morph<T, A, B, C>(
  tree: Tree,
  filePath: string,
  op1: CodeMorphOperator<CodeMorphState<T>, A>,
  op2: CodeMorphOperator<A, B>,
  op3: CodeMorphOperator<B, C>
): CodeMorphResult<C>;
export function morph<T, A, B, C, D>(
  tree: Tree,
  filePath: string,
  op1: CodeMorphOperator<CodeMorphState<T>, A>,
  op2: CodeMorphOperator<A, B>,
  op3: CodeMorphOperator<B, C>,
  op4: CodeMorphOperator<C, D>
): CodeMorphResult<D>;
export function morph<T, A, B, C, D, E>(
  tree: Tree,
  filePath: string,
  op1: CodeMorphOperator<CodeMorphState<T>, A>,
  op2: CodeMorphOperator<A, B>,
  op3: CodeMorphOperator<B, C>,
  op4: CodeMorphOperator<C, D>,
  op5: CodeMorphOperator<D, E>
): CodeMorphResult<E>;
export function morph<T, A, B, C, D, E, F>(
  tree: Tree,
  filePath: string,
  op1: CodeMorphOperator<CodeMorphState<T>, A>,
  op2: CodeMorphOperator<A, B>,
  op3: CodeMorphOperator<B, C>,
  op4: CodeMorphOperator<C, D>,
  op5: CodeMorphOperator<D, E>,
  op6: CodeMorphOperator<E, F>
): CodeMorphResult<F>;
export function morph<T, A, B, C, D, E, F, G>(
  tree: Tree,
  filePath: string,
  op1: CodeMorphOperator<CodeMorphState<T>, A>,
  op2: CodeMorphOperator<A, B>,
  op3: CodeMorphOperator<B, C>,
  op4: CodeMorphOperator<C, D>,
  op5: CodeMorphOperator<D, E>,
  op6: CodeMorphOperator<E, F>,
  op7: CodeMorphOperator<F, G>
): CodeMorphResult<G>;
export function morph<T, A, B, C, D, E, F, G, H>(
  tree: Tree,
  filePath: string,
  op1: CodeMorphOperator<CodeMorphState<T>, A>,
  op2: CodeMorphOperator<A, B>,
  op3: CodeMorphOperator<B, C>,
  op4: CodeMorphOperator<C, D>,
  op5: CodeMorphOperator<D, E>,
  op6: CodeMorphOperator<E, F>,
  op7: CodeMorphOperator<F, G>,
  op8: CodeMorphOperator<G, H>
): CodeMorphResult<H>;
export function morph<T, A, B, C, D, E, F, G, H, I>(
  tree: Tree,
  filePath: string,
  op1: CodeMorphOperator<CodeMorphState<T>, A>,
  op2: CodeMorphOperator<A, B>,
  op3: CodeMorphOperator<B, C>,
  op4: CodeMorphOperator<C, D>,
  op5: CodeMorphOperator<D, E>,
  op6: CodeMorphOperator<E, F>,
  op7: CodeMorphOperator<F, G>,
  op8: CodeMorphOperator<G, H>,
  op9: CodeMorphOperator<H, I>
): CodeMorphResult<I>;
export function morph<T>(
  tree: Tree,
  filePath: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...operators: CodeMorphOperator<any, any>[]
): CodeMorphResult<unknown> {
  const fileName = path.basename(filePath);
  const project = new Project();
  const code = tree.read(filePath)?.toString() ?? '';
  const sourceFile = project.createSourceFile(fileName, code);

  const state: CodeMorphState<T> = {
    tree,
    fullPath: filePath,
    fileName,
    project,
    sourceFile,
    withResult: false
  };

  const result = operators.reduce(
    (acc: CodeMorphState<unknown>, op: CodeMorphOperator<unknown, unknown>) => op(acc),
    state
  );

  return {
    save: () => result.tree.write(result.fullPath, result.sourceFile.getText()),
    state: () => result,
    toString: () => result.sourceFile.getText()
  };
}

export function variable<T>(name: string, kind?: SyntaxKind) {
  return (state: CodeMorphState<T>): CodeMorphState<VariableDeclaration> => {
    const decl = state.sourceFile.getVariableDeclarations().find(d => d.getName() === name);

    if (decl !== undefined) {
      const isKindMatched = kind === undefined
        ? true
        : decl.getInitializer()?.getKind() === kind;

      if (isKindMatched) {
        return {
          ...state,
          withResult: true,
          result: decl
        };
      }
    }

    return {
      ...state,
      withResult: false
    };
  };
}

export function modifyVariable(mod: (decl: VariableDeclaration) => void) {
  return (state: CodeMorphState<VariableDeclaration>): CodeMorphState<VariableDeclaration> => {
    if (state.withResult) {
      mod(state.result);
    }

    return state;
  };
}

export function addImportDeclaration<T>(namedImports: string[], moduleSpecifier: string) {
  return (state: CodeMorphState<T>): CodeMorphState<T> => {
    state.sourceFile.addImportDeclaration({ namedImports, moduleSpecifier });
    return state;
  };
}
