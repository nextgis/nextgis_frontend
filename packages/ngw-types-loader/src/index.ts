#!/usr/bin/env node

import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';
import * as readline from 'readline';

// ANSI escape codes for colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',

  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    crimson: '\x1b[38m', // Scarlet
  },
  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
    crimson: '\x1b[48m',
  },
};

const DEFAULT_DOMAIN = 'https://demo.nextgis.com';
const API_PATH = '/api/component/pyramid/codegen/api_type';
const DECLARATION_FILE_NAME = 'nextgisweb.d.ts';
const TSCONFIG_PATH = 'tsconfig.json';

// Function to display manual include instructions
function promptManualInclude(relativeDeclarationPath: string) {
  console.log(
    colors.fg.yellow +
      'Please manually add the following line to your tsconfig.json "include" section:',
  );
  console.log(colors.bright + `"${relativeDeclarationPath}"` + colors.reset);
}

// Function to download the TypeScript declaration file
function downloadDeclarationFile(domain: string = DEFAULT_DOMAIN) {
  const url = `${domain}${API_PATH}`;
  const fullDeclarationPath = path.resolve(
    process.cwd(),
    DECLARATION_FILE_NAME,
  );

  console.log(
    colors.fg.blue +
      `Downloading TypeScript declaration file from ${colors.bright}${url}${colors.reset}...`,
  );

  // Create a write stream to save the downloaded file
  const file = fs.createWriteStream(fullDeclarationPath);

  https
    .get(url, (response) => {
      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(
          colors.fg.green +
            `The file ${colors.bright}${fullDeclarationPath}${colors.reset} has been successfully downloaded.`,
        );
        promptTsConfigUpdate();
      });
    })
    .on('error', (err) => {
      fs.unlinkSync(fullDeclarationPath);
      console.error(
        colors.fg.red +
          `Error downloading the declaration file: ${err.message}` +
          colors.reset,
      );
    });
}

function updateTsConfig() {
  const fullTsConfigPath = path.resolve(process.cwd(), TSCONFIG_PATH);
  const fullDeclarationPath = path.resolve(
    process.cwd(),
    DECLARATION_FILE_NAME,
  );

  // Calculate relative path to be included in tsconfig.json
  const relativeDeclarationPath = path.relative(
    path.dirname(fullTsConfigPath),
    fullDeclarationPath,
  );

  if (!fs.existsSync(fullTsConfigPath)) {
    console.warn(
      colors.fg.yellow +
        `tsconfig.json not found at ${colors.bright}${fullTsConfigPath}${colors.reset}. Please manually add the declaration file to your tsconfig.json.`,
    );
    return;
  }

  const tsconfigContent = fs.readFileSync(fullTsConfigPath, 'utf-8');

  try {
    const tsconfig = JSON.parse(tsconfigContent);

    if (!tsconfig.include) {
      tsconfig.include = [];
    }

    // Add the relative path to the declaration file
    if (!tsconfig.include.includes(relativeDeclarationPath)) {
      tsconfig.include.push(relativeDeclarationPath);
      fs.writeFileSync(fullTsConfigPath, JSON.stringify(tsconfig, null, 2));
      console.log(
        colors.fg.green +
          `The relative path to the declaration file has been added to tsconfig.json: ${colors.bright}${relativeDeclarationPath}${colors.reset}`,
      );
    } else {
      console.log(
        colors.fg.yellow +
          `The declaration file path already exists in tsconfig.json.` +
          colors.reset,
      );
    }
  } catch (error) {
    console.error(
      colors.fg.red +
        `Error parsing tsconfig.json: ${(error as Error).message}` +
        colors.reset,
    );
    promptManualInclude(relativeDeclarationPath);
  }
}

// Function to prompt the user if they want to update tsconfig.json
function promptTsConfigUpdate() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(
    colors.fg.cyan +
      'Would you like to update tsconfig.json to include the declaration file? (yes/no) ' +
      colors.reset,
    (answer) => {
      if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
        updateTsConfig();
      } else {
        const fullDeclarationPath = path.resolve(
          process.cwd(),
          DECLARATION_FILE_NAME,
        );
        const fullTsConfigPath = path.resolve(process.cwd(), TSCONFIG_PATH);
        const relativeDeclarationPath = path.relative(
          path.dirname(fullTsConfigPath),
          fullDeclarationPath,
        );
        promptManualInclude(relativeDeclarationPath);
      }
      rl.close();
    },
  );
}

// Main function to handle the CLI execution
function run() {
  const [, , customDomain] = process.argv;
  const domain = customDomain || DEFAULT_DOMAIN;
  const fullTsConfigPath = path.resolve(process.cwd(), TSCONFIG_PATH);

  if (fs.existsSync(fullTsConfigPath)) {
    console.log(
      colors.fg.green +
        `Found tsconfig.json at ${colors.bright}${fullTsConfigPath}${colors.reset}.`,
    );
  } else {
    console.warn(
      colors.fg.yellow +
        `tsconfig.json not found at ${colors.bright}${fullTsConfigPath}${colors.reset}. You will need to manually add the declaration file.`,
    );
  }

  downloadDeclarationFile(domain);
}

run();
