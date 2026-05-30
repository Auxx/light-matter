import { ExecutorContext, joinPathFragments } from '@nx/devkit';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { ImportIconsExecutorSchema } from './import-icons.schema';

export async function importIconsExecutor(options: ImportIconsExecutorSchema, _context: ExecutorContext) {
  const config: Record<string, string> = JSON.parse(fs.readFileSync(options.config, { encoding: 'utf8' }));
  joinPathFragments('node_modules', '');

  const iconPaths = Object.entries(config)
    .map(([ key, value ]) => ({
      name: key,
      path: joinPathFragments('node_modules', value),
      fileName: joinPathFragments(options.target, `${path.basename(value, '.svg')}.ts`),
      importPath: `${path.basename(value, '.svg')}`
    }));

  const iconImports: string[] = [];
  const constDecl: string[] = [];
  const iconMapping: string[] = [];

  iconPaths.forEach(item => {
    const svg = fs.readFileSync(item.path, { encoding: 'utf8' });
    const result = `export const ${item.name} = ${JSON.stringify(svg)};`;
    fs.writeFileSync(item.fileName, result, { encoding: 'utf8' });

    iconImports.push(`import { ${item.name} } from './${item.importPath}';`);
    constDecl.push(`'${item.name}'`);
    iconMapping.push(item.name);
  });

  const result = `${iconImports.join('\n')}\n\n`
    + `export const allIcons = [\n${constDecl.join(',\n')}] as const;\n\n`
    + `export type IconName = typeof allIcons[number];\n\n`
    + `export const iconMapping: Record<IconName, string> = {\n${iconMapping.join(',\n')}\n};\n`;

  fs.writeFileSync(
    joinPathFragments(options.target, 'icon.mapping.ts'),
    result,
    { encoding: 'utf8' }
  );

  return {
    success: true
  };
}

export default importIconsExecutor;
