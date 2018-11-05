const { lstatSync, readdirSync, readFileSync, existsSync } = require('fs');
const { join } = require('path');


function generate(source = '../') {
  const items = [];
  const isDirectory = (source) => lstatSync(source).isDirectory();
  const getIdFromPath = (id) => {
    id = id.replace(/\.\\/g, '');
    id = id.replace(/\\/g, '-');
    id = id.replace(/\./g, '');
    return id;
  }

  readdirSync(source)
    .forEach((name) => {
      const libPath = join(source, name);
      if (isDirectory(libPath)) {
        const examplesPath = join(libPath, 'examples');
        const examples = [];
        if (existsSync(examplesPath) && isDirectory(examplesPath)) {
          readdirSync(examplesPath)
            .map(name => join(examplesPath, name))
            .filter(isDirectory)
            .forEach((examplePath) => {
              const id = getIdFromPath(examplePath);
              if (existsSync(examplePath) && isDirectory(examplePath)) {
                const htmlPath = join(examplePath, 'index.html');
                const metaPath = join(examplePath, 'index.json');
                if (existsSync(htmlPath) && existsSync(metaPath)) {
                  const meta = JSON.parse(readFileSync(metaPath, 'utf8'));
                  const example = {
                    id,
                    html: readFileSync(htmlPath, 'utf8'),
                    name: meta.name,
                    description: meta.description
                  }
                  examples.push(example)
                }
              }
            });
        }
        if (examples.length) {
          const item = {
            name,
            id: libPath,
            children: examples
          };
          items.push(item);
        }
      }
    });
  return items;
}

module.exports = generate;

generate();
