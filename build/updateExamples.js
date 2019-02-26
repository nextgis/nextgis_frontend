const { lstatSync, readdirSync, readFileSync, existsSync, writeFileSync } = require('fs');
const { join } = require('path');
const changeHtmlMapAdapter = require('../packages/demo/scripts/changeHtmlMapAdapter');

const packagesPath = './packages';

const isDirectory = (source) => existsSync(source) && lstatSync(source).isDirectory();

function updateExamples() {

  // find demo examples folder
  const demoExamplesPath = join(packagesPath, 'demo', 'examples');
  if (existsSync(demoExamplesPath)) {
    readdirSync(demoExamplesPath).forEach((name) => {
      const examplePath = join(demoExamplesPath, name);
      if (isDirectory(examplePath)) {
        const metaPath = join(examplePath, 'index.json');
        const htmlPath = join(examplePath, 'index.html');
        if (existsSync(metaPath) && existsSync(htmlPath)) {
          const meta = JSON.parse(readFileSync(metaPath, 'utf8'));
          if (meta.ngwMaps) {
            meta.ngwMaps.forEach((x) => {
              copyExampleToLib(x, examplePath, name);
            });
          }
        }
      }
    });
  }
}

function copyExampleToLib(packageName, exampleFolderPath, exampleName) {
  const libExamplesPath = join(packagesPath, packageName, 'examples', exampleName);

  const metaPath = join(exampleFolderPath, 'index.json');
  const htmlPath = join(exampleFolderPath, 'index.html');

  // copy index.json
  const meta = JSON.parse(readFileSync(metaPath, 'utf8'));
  const { ngwMaps, ...opts } = meta;
  const newMeta = { ...opts, _copiedFrom: exampleFolderPath };
  writeFileSync(join(libExamplesPath, 'index.json'), JSON.stringify(newMeta));

  // copy html
  const html = readFileSync(htmlPath, 'utf8');
  let newHtml = changeHtmlMapAdapter(html, packageName, ngwMaps);

  newHtml = newHtml.replace(/..\/..\/..\/([a-zA-Z\-]+)\//g, (m, g) => {
    if (g === packageName) {
      return '../../';
    }
    return m;
  })


  writeFileSync(join(libExamplesPath, 'index.html'), newHtml);

}

module.exports = updateExamples;

updateExamples();
