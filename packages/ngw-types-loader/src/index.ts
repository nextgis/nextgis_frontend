#!/usr/bin/env node

import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';
import * as readline from 'readline';

import chalk from 'chalk';

const DEFAULT_DOMAIN = 'https://demo.nextgis.com';
const API_PATH = '/api/component/pyramid/codegen/api_type';
const DECLARATION_FILE_NAME = 'nextgisweb.d.ts';
const TSCONFIG_PATH = 'tsconfig.json';

// Function to download the TypeScript declaration file
function downloadDeclarationFile(domain: string = DEFAULT_DOMAIN) {
  const url = `${domain}${API_PATH}`;
  const fullDeclarationPath = path.resolve(
    process.cwd(),
    DECLARATION_FILE_NAME,
  );

  console.log(
    chalk.blue(
      `Downloading TypeScript declaration file from ${chalk.bold(url)}...`,
    ),
  );

  // Create a write stream to save the downloaded file
  const file = fs.createWriteStream(fullDeclarationPath);

  https
    .get(url, (response) => {
      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(
          chalk.green(
            `The file ${chalk.bold(fullDeclarationPath)} has been successfully downloaded.`,
          ),
        );
        promptTsConfigUpdate();
      });
    })
    .on('error', (err) => {
      fs.unlinkSync(fullDeclarationPath);
      console.error(
        chalk.red(`Error downloading the declaration file: ${err.message}`),
      );
    });
}

// Function to update tsconfig.json with the relative path to the declaration file
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
      chalk.yellow(
        `tsconfig.json not found at ${chalk.bold(fullTsConfigPath)}. Please manually add the declaration file to your tsconfig.json.`,
      ),
    );
    return;
  }

  const tsconfig = JSON.parse(fs.readFileSync(fullTsConfigPath, 'utf-8'));

  if (!tsconfig.include) {
    tsconfig.include = [];
  }

  // Add the relative path to the declaration file
  if (!tsconfig.include.includes(relativeDeclarationPath)) {
    tsconfig.include.push(relativeDeclarationPath);
    fs.writeFileSync(fullTsConfigPath, JSON.stringify(tsconfig, null, 2));
    console.log(
      chalk.green(
        `The relative path to the declaration file has been added to tsconfig.json: ${chalk.bold(relativeDeclarationPath)}`,
      ),
    );
  } else {
    console.log(
      chalk.yellow(
        `The declaration file path already exists in tsconfig.json.`,
      ),
    );
  }
}

// Function to prompt the user if they want to update tsconfig.json
function promptTsConfigUpdate() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(
    chalk.cyan(
      'Would you like to update tsconfig.json to include the declaration file? (yes/no) ',
    ),
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
        console.log(
          chalk.yellow(
            'Please manually add the following line to your tsconfig.json "include" section:',
          ),
        );
        console.log(chalk.bold(`"${relativeDeclarationPath}"`));
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
      chalk.green(`Found tsconfig.json at ${chalk.bold(fullTsConfigPath)}.`),
    );
  } else {
    console.warn(
      chalk.yellow(
        `tsconfig.json not found at ${chalk.bold(fullTsConfigPath)}. You will need to manually add the declaration file.`,
      ),
    );
  }

  downloadDeclarationFile(domain);
}

run();
