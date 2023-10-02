const fs = require('fs');
const { join } = require('path');
const changeHtmlMapAdapter = require('../demo/scripts/changeHtmlMapAdapter');

const packagesPath = './packages';

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

  if (!fs.existsSync(libExamplesPath)) {
    fs.mkdirSync(libExamplesPath);
  }

  // copy index.json
  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));

  const { ngwMaps, ...opts } = meta;
  const newMeta = { ...opts };
  fs.writeFileSync(
    join(libExamplesPath, 'index.json'),
    JSON.stringify(newMeta),
  );

  // copy html
  const html = fs.readFileSync(htmlPath, 'utf8');
  let newHtml = changeHtmlMapAdapter(html, packageName, ngwMaps);

  newHtml = newHtml.replace(/..\/..\/..\/packages\/([a-zA-Z-]+)\//g, (m, g) => {
    if (g === packageName) {
      return '../../';
    }
    return `../../../${g}/`;
  });

  fs.writeFileSync(join(libExamplesPath, 'index.html'), newHtml);
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
}

module.exports = updateExamples;

updateExamples();
