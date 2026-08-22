#!/usr/bin/env node

import * as https from 'node:https';

import { installDeclarationModules } from './install.cjs';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  fg: {
    blue: '\x1b[34m',
    green: '\x1b[32m',
    red: '\x1b[31m',
  },
};

const DEFAULT_DOMAIN = 'https://demo.nextgis.com';
const API_PATH = '/api/component/pyramid/codegen/api_type';

function downloadDeclarationFile(domain: string): Promise<string> {
  const url = `${domain}${API_PATH}`;

  console.log(
    colors.fg.blue +
      `Downloading TypeScript declarations from ${colors.bright}${url}${colors.reset}...`,
  );

  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          response.resume();
          reject(
            new Error(
              `Unable to download declarations: HTTP ${response.statusCode}`,
            ),
          );
          return;
        }

        response.setEncoding('utf8');
        let content = '';
        response.on('data', (chunk: string) => {
          content += chunk;
        });
        response.on('end', () => resolve(content));
      })
      .on('error', reject);
  });
}

async function run() {
  const [, , customDomain] = process.argv;
  const domain = customDomain || DEFAULT_DOMAIN;
  const content = await downloadDeclarationFile(domain);
  const result = installDeclarationModules(content);

  console.log(
    colors.fg.green +
      `Installed ${colors.bright}${result.moduleCount}${colors.reset}${colors.fg.green} declaration modules in ${colors.bright}${result.packageCount}${colors.reset}${colors.fg.green} packages.${colors.reset}`,
  );
}

run().catch((error: Error) => {
  console.error(colors.fg.red + error.message + colors.reset);
  process.exitCode = 1;
});
