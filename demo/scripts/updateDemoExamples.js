import fs from 'fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import chalk from 'chalk';

import { generateExamples } from './generateExamplesScheme.js';

const pkgRoot = path.join(fileURLToPath(import.meta.url), '..', '..');

function countEntries(examples) {
  let count = 0;

  examples.forEach((example) => {
    count++; // Count the current example
    if (example.children && Array.isArray(example.children)) {
      count += countEntries(example.children); // Recursively count children
    }
  });

  return count;
}

async function updateDemoExamples() {
  console.log(
    chalk.blue('The update process for the example file has started....'),
  );

  try {
    const examples = generateExamples();
    const totalCount = countEntries(examples);

    const filePath = path.join(pkgRoot, 'src', 'examples.json');

    const fileData = JSON.stringify(examples);
    await fs.writeFile(filePath, fileData);
    console.log(
      chalk.green(
        `Successfully added ${totalCount} examples to the file: ${filePath}`,
      ),
    );

    const fileStats = await fs.stat(filePath);
    const fileSizeInKb = (fileStats.size / 1024).toFixed(2) + 'KB';
    console.log(chalk.yellow(`File size: ${fileSizeInKb}`));
  } catch (error) {
    console.error(chalk.red(`Error occurred during update: ${error.message}`));
  } finally {
    console.log(chalk.blue('Update process completed.'));
  }
}

updateDemoExamples();
