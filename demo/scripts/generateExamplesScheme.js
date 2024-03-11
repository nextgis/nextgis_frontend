import { existsSync, lstatSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { URL, fileURLToPath } from 'node:url';

const pkgRoot = path.join(
  fileURLToPath(new URL(import.meta.url)),
  '..',
  '..',
  '..',
);

const isDirectory = (source) => lstatSync(source).isDirectory();

const getPriority = (pkg) =>
  pkg._priority !== undefined ? pkg._priority : 100;

function getIdFromPath(id) {
  id = id.replace(pkgRoot, '');
  id = id.replace(/\.[/\\\\]/g, '');
  id = id.replace(/[/\\\\]/g, '-');
  id = id.replace(/^-packages-/g, '');
  id = id.replace(/^-/g, '');
  id = id.replace(/\./g, '');
  return id;
}

function replaceAbsolutePathToCdn(line, packages) {
  if (line && packages && packages.length) {
    let newLine = line;
    const emptyCharsCount = line.search(/\S/);

    const isLibPath = line.match(
      /(?:src|href)=("|').*?(lib\/).*?([-\w.]+)\.(?:([-\w.]+)\.)((?:js|css))/,
    );

    if (isLibPath) {
      newLine = '';
      const lineLibName = isLibPath[3];

      if (lineLibName) {
        for (let fry = 0; fry < packages.length; fry++) {
          const pkg = packages[fry] && packages[fry].package;
          const packageLibName = pkg.name.replace(/^@nextgis\//, '');
          if (packageLibName === lineLibName) {
            newLine =
              new Array(emptyCharsCount + 1).join(' ') +
              `<script src="https://unpkg.com/${pkg.name}@${pkg.version}/${pkg.unpkg}"></script>`;
          }
        }
      }
    }

    line = newLine;
  }
  return line;
}

function prepareHtml(html, _pkg, packages) {
  const newHtml = [];

  // comment direct to lib script
  html.split('\n').forEach((line) => {
    line = replaceAbsolutePathToCdn(line, packages);
    newHtml.push(line);
  });
  return newHtml.join('\n');
}

function getReadme(libPath) {
  const readme = [];
  const readmePath = path.join(libPath, 'README.md');
  if (existsSync(readmePath)) {
    const readmeMd = readFileSync(readmePath, 'utf8');
    const id = getIdFromPath(libPath);
    readme.push({
      id: id + '-readme',
      // html: converter.makeHtml(readmeMd),
      md: readmeMd,
      name: 'README',
      page: 'readme',
    });
  }
  return readme;
}

function getExamples(libPath, pkg, packages) {
  const examplesPath = path.join(libPath, 'examples');
  const examples = [];
  if (existsSync(examplesPath) && isDirectory(examplesPath)) {
    readdirSync(examplesPath)
      .map((name) => path.join(examplesPath, name))
      .filter(isDirectory)
      .forEach((examplePath) => {
        const id = getIdFromPath(examplePath);
        if (existsSync(examplePath) && isDirectory(examplePath)) {
          const htmlPath = path.join(examplePath, 'index.html');
          const metaPath = path.join(examplePath, 'index.json');
          if (existsSync(htmlPath) && existsSync(metaPath)) {
            const meta = JSON.parse(readFileSync(metaPath, 'utf8'));
            const html = prepareHtml(
              readFileSync(htmlPath, 'utf8'),
              pkg,
              packages,
            );

            const filteredPackages = !meta.ngwMaps
              ? []
              : packages.filter((x) => {
                  return (
                    meta.ngwMaps.indexOf(x.name.replace('@nextgis/', '')) !== -1
                  );
                });
            const ngwMaps = filteredPackages.map((x) => {
              return {
                name: x.package.name.replace('@nextgis/', ''),
                version: x.package.version,
                main: x.package.main,
              };
            });
            const example = {
              id,
              html,
              page: 'example',
              name: meta.name,
              description: meta.description,
              tags: meta.tags || [],
              ngwMaps,
            };
            examples.push(example);
          }
        }
      });
  }
  return examples;
}

export function generateExamples() {
  const items = [];

  // add global README
  const readmeItem = getReadme(pkgRoot)[0];
  readmeItem.id = 'readme';
  items.push(readmeItem);

  const packages = [
    {
      libPath: path.join(pkgRoot, 'demo'),
      package: JSON.parse(
        readFileSync(path.join(pkgRoot, 'demo', 'package.json'), 'utf8'),
      ),
      name: 'demo',
    },
  ];
  const packagesPath = path.join(pkgRoot, 'packages');
  readdirSync(packagesPath).forEach((name) => {
    const libPath = path.join(packagesPath, name);

    // find packages
    if (isDirectory(libPath)) {
      const packagePath = path.join(libPath, 'package.json');
      if (existsSync(packagePath)) {
        const pkg = JSON.parse(readFileSync(packagePath, 'utf8'));
        packages.push({
          libPath,
          package: pkg,
          name,
        });
      }
    }
  });

  packages
    .sort((a, b) => {
      return getPriority(a.package) - getPriority(b.package);
    })
    .forEach(({ libPath, package: pkg, name }) => {
      let pages = [];

      pages = pages.concat(getReadme(libPath));
      pages = pages.concat(getExamples(libPath, pkg, packages));

      if (pages.length) {
        const item = {
          name,
          id: getIdFromPath(libPath),
          children: pages,
          priority: getPriority(pkg),
        };
        items.push(item);
        // console.log(item.id);
      }
    });

  const log = (item, n) => {
    // console.log(new Array(n + 1).join('-') + item.name);
    if (item.children && item.children.length) {
      n++;
      item.children.forEach((x) => {
        log(x, n);
      });
    }
  };
  items.forEach((x) => log(x, 1));
  return items;
}
