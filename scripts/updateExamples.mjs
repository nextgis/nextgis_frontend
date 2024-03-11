import fs from 'node:fs';
import { join } from 'node:path';

import chalk from 'chalk';

import changeHtmlMapAdapter from '../demo/scripts/changeHtmlMapAdapter.mjs';

const packagesPath = './packages';

let updatedExamplesCount = 0;

const isDirectory = (source) =>
  fs.existsSync(source) && fs.lstatSync(source).isDirectory();

function copyExampleToLib(packageName, exampleFolderPath, exampleName) {
  const libExamplesPath = join(
    packagesPath,
    packageName,
    'examples',
    exampleName,
  );

  const metaPath = join(exampleFolderPath, 'index.json');
  const htmlPath = join(exampleFolderPath, 'index.html');
  const newMetaPath = join(libExamplesPath, 'index.json');
  const newHtmlPath = join(libExamplesPath, 'index.html');

  if (!fs.existsSync(libExamplesPath)) {
    fs.mkdirSync(libExamplesPath);
  }

  // copy index.json
  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));

  const { ngwMaps, ...opts } = meta;
  const newMeta = { ...opts };
  fs.writeFileSync(newMetaPath, JSON.stringify(newMeta));

  // copy html
  const html = fs.readFileSync(htmlPath, 'utf8');
  let newHtml = changeHtmlMapAdapter(html, packageName, ngwMaps);

  newHtml = newHtml.replace(/..\/..\/..\/packages\/([a-zA-Z-]+)\//g, (m, g) => {
    if (g === packageName) {
      return '../../';
    }
    return `../../../${g}/`;
  });

  // Check if the content is different and update count
  if (
    !fs.existsSync(newHtmlPath) ||
    fs.readFileSync(newHtmlPath, 'utf8') !== newHtml
  ) {
    updatedExamplesCount++;
    console.log(chalk.blue(`Updating example: ${packageName}/${exampleName}`));
  }

  fs.writeFileSync(newHtmlPath, newHtml);
}

function updateExamples() {
  // find demo examples folder
  const demoExamplesPath = join('demo', 'examples');
  if (fs.existsSync(demoExamplesPath)) {
    fs.readdirSync(demoExamplesPath).forEach((name) => {
      const examplePath = join(demoExamplesPath, name);
      if (isDirectory(examplePath)) {
        const metaPath = join(examplePath, 'index.json');
        const htmlPath = join(examplePath, 'index.html');
        if (fs.existsSync(metaPath) && fs.existsSync(htmlPath)) {
          const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
          if (meta.ngwMaps && !meta.onlyForDemo) {
            meta.ngwMaps.forEach((x) => {
              copyExampleToLib(x, examplePath, name);
            });
          }
        }
      }
    });
  }

  console.log(chalk.green(`Total updated examples: ${updatedExamplesCount}`));
}

updateExamples();
