import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import ts from 'typescript';

import installer from '../lib/install.cjs';

const { installDeclarationModules } = installer;

const declarations = `
declare module "@nextgisweb/resource/type/api" {
  export interface ResourceRef {
    id: number;
  }
}

declare module "@nextgisweb/webmap/type/api" {
  import type * as _resource from "@nextgisweb/resource/type/api";

  export interface WebMapItem {
    resource: _resource.ResourceRef;
  }
}
`;

function createTemporaryProject() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'ngw-types-loader-'));
}

test('installs linked declarations as resolvable packages', () => {
  const projectPath = createTemporaryProject();

  try {
    installDeclarationModules(declarations, projectPath);

    const resourceDeclaration = path.join(
      projectPath,
      'node_modules',
      '@nextgisweb',
      'resource',
      'type',
      'api.d.ts',
    );
    const webmapDeclaration = path.join(
      projectPath,
      'node_modules',
      '@nextgisweb',
      'webmap',
      'type',
      'api.d.ts',
    );

    assert.equal(fs.existsSync(resourceDeclaration), true);
    assert.match(
      fs.readFileSync(webmapDeclaration, 'utf8'),
      /from "@nextgisweb\/resource\/type\/api"/,
    );

    const nodeTypesPath = path.join(
      projectPath,
      'node_modules',
      '@types',
      'node',
    );
    const sourcePath = path.join(projectPath, 'index.ts');
    fs.mkdirSync(nodeTypesPath, { recursive: true });
    fs.writeFileSync(path.join(nodeTypesPath, 'index.d.ts'), '');
    fs.writeFileSync(
      sourcePath,
      `import type { WebMapItem } from "@nextgisweb/webmap/type/api";\nconst item: WebMapItem = { resource: { id: 1 } };\n`,
    );

    const program = ts.createProgram([sourcePath], {
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      noEmit: true,
      strict: true,
      typeRoots: [path.join(projectPath, 'node_modules', '@types')],
      types: ['node'],
    });
    const diagnostics = ts.getPreEmitDiagnostics(program);

    assert.deepEqual(
      diagnostics.map((diagnostic) =>
        ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
      ),
      [],
    );

    installDeclarationModules(
      `declare module "@nextgisweb/resource/type/api" { export interface ResourceRef { id: number; } }`,
      projectPath,
    );
    assert.equal(fs.existsSync(webmapDeclaration), false);
  } finally {
    fs.rmSync(projectPath, { force: true, recursive: true });
  }
});

test('rejects declaration paths outside the generated scope', () => {
  const projectPath = createTemporaryProject();

  try {
    assert.throws(
      () =>
        installDeclarationModules(
          `declare module "@nextgisweb/../outside" { export interface Unsafe {} }`,
          projectPath,
        ),
      /Unsupported NGW module name/,
    );
  } finally {
    fs.rmSync(projectPath, { force: true, recursive: true });
  }
});
