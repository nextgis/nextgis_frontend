import * as fs from 'node:fs';
import * as path from 'node:path';

import ts from 'typescript';

const GENERATED_SCOPE = '@nextgisweb';
const MARKER_FILE_NAME = '.ngw-types-loader';
const MODULE_NAME_PATTERN =
  /^@nextgisweb\/([a-z0-9]+(?:-[a-z0-9]+)*)\/([a-z0-9]+(?:[._-][a-z0-9]+)*(?:\/[a-z0-9]+(?:[._-][a-z0-9]+)*)*)$/;

interface GeneratedModule {
  content: string;
  modulePath: string;
}

function parseDeclarationModules(content: string): GeneratedModule[] {
  const sourceFile = ts.createSourceFile(
    'nextgisweb.d.ts',
    content,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  const modules: GeneratedModule[] = [];
  const moduleNames = new Set<string>();

  for (const statement of sourceFile.statements) {
    if (
      !ts.isModuleDeclaration(statement) ||
      !ts.isStringLiteral(statement.name) ||
      !statement.body ||
      !ts.isModuleBlock(statement.body)
    ) {
      throw new Error('Unsupported declaration file structure');
    }

    const moduleName = statement.name.text;
    const match = MODULE_NAME_PATTERN.exec(moduleName);
    if (!match) {
      throw new Error(`Unsupported NGW module name: ${moduleName}`);
    }
    if (moduleNames.has(moduleName)) {
      throw new Error(`Duplicate NGW module name: ${moduleName}`);
    }
    moduleNames.add(moduleName);

    const [, packageName, modulePath] = match;
    const statements = statement.body.statements.map((child) =>
      printer.printNode(ts.EmitHint.Unspecified, child, sourceFile),
    );

    modules.push({
      content: `${statements.join('\n\n')}\n`,
      modulePath: path.join(packageName, `${modulePath}.d.ts`),
    });
  }

  if (modules.length === 0) {
    throw new Error('No NGW modules found in the declaration file');
  }

  return modules;
}

function getGeneratedPackages(scopePath: string): string[] {
  if (!fs.existsSync(scopePath)) {
    return [];
  }

  return fs
    .readdirSync(scopePath, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        fs.existsSync(path.join(scopePath, entry.name, MARKER_FILE_NAME)),
    )
    .map((entry) => entry.name);
}

export function installDeclarationModules(
  content: string,
  projectPath: string = process.cwd(),
) {
  const modules = parseDeclarationModules(content);
  const scopePath = path.join(projectPath, 'node_modules', GENERATED_SCOPE);
  const packageNames = new Set(
    modules.map(({ modulePath }) => modulePath.split(path.sep)[0]),
  );
  const generatedPackages = getGeneratedPackages(scopePath);

  for (const packageName of packageNames) {
    const packagePath = path.join(scopePath, packageName);
    if (
      fs.existsSync(packagePath) &&
      !generatedPackages.includes(packageName)
    ) {
      throw new Error(
        `Refusing to overwrite package ${GENERATED_SCOPE}/${packageName}`,
      );
    }
  }

  for (const packageName of generatedPackages) {
    fs.rmSync(path.join(scopePath, packageName), {
      force: true,
      recursive: true,
    });
  }

  for (const packageName of packageNames) {
    const packagePath = path.join(scopePath, packageName);
    fs.mkdirSync(packagePath, { recursive: true });
    fs.writeFileSync(path.join(packagePath, MARKER_FILE_NAME), '');
    fs.writeFileSync(
      path.join(packagePath, 'package.json'),
      `${JSON.stringify(
        {
          name: `${GENERATED_SCOPE}/${packageName}`,
          private: true,
          version: '0.0.0',
        },
        null,
        2,
      )}\n`,
    );
  }

  for (const module of modules) {
    const declarationPath = path.join(scopePath, module.modulePath);
    fs.mkdirSync(path.dirname(declarationPath), { recursive: true });
    fs.writeFileSync(declarationPath, module.content);
  }

  return {
    moduleCount: modules.length,
    packageCount: packageNames.size,
  };
}
