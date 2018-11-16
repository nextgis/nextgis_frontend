const { lstatSync, readdirSync, readFileSync, existsSync } = require('fs');
const { join } = require('path');
const showdown = require('showdown');
const showdownHighlight = require("showdown-highlight");

const converter = new showdown.Converter({
  extensions: [showdownHighlight]
});

const isDirectory = (source) => lstatSync(source).isDirectory();

function generate(source = '../') {
  const items = [];

  // add global README
  const readmeItem = getReadme(join(source, '../'))[0];
  readmeItem.id = 'readme';
  items.push(readmeItem);

  readdirSync(source)
    .forEach((name) => {
      const libPath = join(source, name);

      // find packages
      if (isDirectory(libPath)) {
        const packagePath = join(libPath, 'package.json');
        if (existsSync(packagePath)) {
          const package = JSON.parse(readFileSync(packagePath, 'utf8'));
          if (!package.private) {
            let pages = [];

            pages = pages.concat(getReadme(libPath));
            pages = pages.concat(getExamples(libPath, package));

            if (pages.length) {
              const item = {
                name,
                id: libPath,
                children: pages
              };
              items.push(item);
            }
          }
        }
      }
    });
  const log = (item, n) => {
    console.log(new Array(n + 1).join('-') + item.name);
    if (item.children && item.children.length) {
      n++
      item.children.forEach((x) => {
        log(x, n);
      });
    }
  }
  items.forEach((x) => log(x, 1));
  return items;
}

function getReadme(libPath) {
  const readme = [];
  const readmePath = join(libPath, 'README.md');
  if (existsSync(readmePath)) {
    const readmeMd = readFileSync(readmePath, 'utf8');
    const id = getIdFromPath(libPath);
    readme.push({
      id,
      html: converter.makeHtml(readmeMd),
      name: 'README',
      page: 'readme'
    });
  }
  return readme;
}

function getExamples(libPath, package) {
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
            const html = prepareHtml(readFileSync(htmlPath, 'utf8'), package);
            const example = {
              id,
              html,
              name: meta.name,
              description: meta.description,
              page: 'example'
            }
            examples.push(example)
          }
        }
      });
  }
  return examples;
}

function getIdFromPath(id) {
  id = id.replace(/\.[/\\\\]/g, '');
  id = id.replace(/[/\\\\]/g, '-');
  id = id.replace(/\./g, '');
  return id;
}

function prepareHtml(html, package) {
  const newHtml = [];
  let libReplace = false;
  let cdnReplace = false;
  // comment direct to lib script
  html.split('\n').forEach((line) => {
    let emptyCharsCount = line.search(/\S/);;

    if (!libReplace) {
      const libregexp = `<script src="../../${package.main}"></script>`;
      const argRegEx = new RegExp(libregexp, 'i');
      const isDirectLibLine = line.match(argRegEx);
      if (isDirectLibLine) {
        line = new Array(emptyCharsCount).join(' ') +  `<!-- ${libregexp} -->`;
        libReplace = true;
      }
    }
    if (!cdnReplace) {
      const pathToLib = package.main.split('/');
      const filename = pathToLib.pop();
      const name = filename.replace('.js', '');
      const cdnregexp = `<script src="https://unpkg.com/@nextgis/${name}@latest"></script>`;
      const argRegEx = new RegExp(cdnregexp, 'g');
      const isDirectLibLine = line.match(argRegEx);
      if (isDirectLibLine) {
        line = new Array(emptyCharsCount + 1).join(' ') +
          `<script src="https://unpkg.com/@nextgis/${name}@${package.version}"></script>`;
        cdnReplace = true;
      }
    }
    newHtml.push(line);
    console.log(line);

  })





  return newHtml;
}

module.exports = generate;

generate();
