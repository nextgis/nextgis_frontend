const { lstatSync, readdirSync, readFileSync, existsSync } = require('fs');
const { join } = require('path');
// const showdown = require('showdown');
// const showdownHighlight = require("showdown-highlight");

// const converter = new showdown.Converter({
//   extensions: [showdownHighlight]
// });
const isDirectory = source => lstatSync(source).isDirectory();

const getPriority = package => (package._priority !== undefined ? package._priority : 100);

function getIdFromPath(id) {
  id = id.replace(/\.[/\\\\]/g, '');
  id = id.replace(/[/\\\\]/g, '-');
  id = id.replace(/\./g, '');
  return id;
}

function replaceAbsolutePathToCdn(line, packages) {
  if (line && packages && packages.length) {
    let newLine = line;
    const emptyCharsCount = line.search(/\S/);

    const isLibPath = line.match(/(?:src|href)=("|').*?(lib\/).*?([-\w.]+)\.((?:js|css))/);

    if (isLibPath) {
      newLine = '';
      const lineLibName = isLibPath[3];

      if (lineLibName) {
        for (let fry = 0; fry < packages.length; fry++) {
          const package = packages[fry] && packages[fry].package;
          const matchMain = package.main && package.main.match(/([-\w.]+)\.(?:js|css)/);
          if (matchMain) {
            const packageLibName = matchMain[1];

            if (packageLibName === lineLibName) {
              newLine =
                new Array(emptyCharsCount + 1).join(' ') +
                `<script src="https://unpkg.com/@nextgis/${packageLibName}@${package.version}/${package.main}"></script>`;
            }
          }
        }
      }
    }

    line = newLine;
  }
  return line;
}

function prepareHtml(html, package, packages) {
  const newHtml = [];

  // comment direct to lib script
  html.split('\n').forEach(line => {
    line = replaceAbsolutePathToCdn(line, packages);
    newHtml.push(line);
  });
  return newHtml.join('\n');
}

function getReadme(libPath) {
  const readme = [];
  const readmePath = join(libPath, 'README.md');
  if (existsSync(readmePath)) {
    const readmeMd = readFileSync(readmePath, 'utf8');
    const id = getIdFromPath(libPath);
    readme.push({
      id: id + '-readme',
      // html: converter.makeHtml(readmeMd),
      md: readmeMd,
      name: 'README',
      page: 'readme'
    });
  }
  return readme;
}

function getExamples(libPath, package, packages) {
  const examplesPath = join(libPath, 'examples');
  const examples = [];
  if (existsSync(examplesPath) && isDirectory(examplesPath)) {
    readdirSync(examplesPath)
      .map(name => join(examplesPath, name))
      .filter(isDirectory)
      .forEach(examplePath => {
        const id = getIdFromPath(examplePath);
        if (existsSync(examplePath) && isDirectory(examplePath)) {
          const htmlPath = join(examplePath, 'index.html');
          const metaPath = join(examplePath, 'index.json');
          if (existsSync(htmlPath) && existsSync(metaPath)) {
            const meta = JSON.parse(readFileSync(metaPath, 'utf8'));
            const html = prepareHtml(readFileSync(htmlPath, 'utf8'), package, packages);

            const filteredPackages = !meta.ngwMaps
              ? []
              : packages.filter(x => {
                  return meta.ngwMaps.indexOf(x.name.replace('@nextgis/', '')) !== -1;
                });
            const ngwMaps = filteredPackages.map(x => {
              return {
                name: x.package.name.replace('@nextgis/', ''),
                version: x.package.version,
                main: x.package.main
              };
            });
            const example = {
              id,
              html,
              page: 'example',
              name: meta.name,
              description: meta.description,
              ngwMaps
            };
            examples.push(example);
          }
        }
      });
  }
  return examples;
}

function generate(source = '../') {
  const items = [];

  // add global READMEs
  const readmeItem = getReadme(join(source, '../'))[0];
  readmeItem.id = 'readme';
  items.push(readmeItem);

  const packages = [
    // { libPath, package }
  ];

  readdirSync(source).forEach(name => {
    const libPath = join(source, name);

    // find packages
    if (isDirectory(libPath)) {
      const packagePath = join(libPath, 'package.json');
      if (existsSync(packagePath)) {
        const package = JSON.parse(readFileSync(packagePath, 'utf8'));
        packages.push({
          libPath,
          package,
          name
        });
      }
    }
  });

  packages
    .sort((a, b) => {
      return getPriority(a.package) - getPriority(b.package);
    })
    .forEach(({ libPath, package, name }) => {
      let pages = [];

      pages = pages.concat(getReadme(libPath));
      pages = pages.concat(getExamples(libPath, package, packages));

      if (pages.length) {
        const item = {
          name,
          id: getIdFromPath(libPath),
          children: pages,
          priority: getPriority(package)
        };
        items.push(item);
      }
    });

  const log = (item, n) => {
    // console.log(new Array(n + 1).join('-') + item.name);
    if (item.children && item.children.length) {
      n++;
      item.children.forEach(x => {
        log(x, n);
      });
    }
  };
  items.forEach(x => log(x, 1));
  return items;
}

module.exports = generate;

generate();
