const { join, resolve } = require('path');
const { lstatSync, readdirSync, readFileSync, existsSync } = require('fs');
const webpack = require('webpack');
const { TopologicalSort } = require('topological-sort');
const rimraf = require('rimraf');

const isDirectory = source => lstatSync(source).isDirectory();
const modules = generate();
const moduleMaps = Object.keys(modules).map(m => [m, modules[m]]);
const sortOp = new TopologicalSort(new Map(moduleMaps));

for (const m in modules) {
  const module = modules[m];
  if (module.deps.length) {
    module.deps.forEach(d => {
      sortOp.addEdge(d, m);
    });
  }
}
const sorted = sortOp.sort();
const sortedKeys = [...sorted.keys()];

let builded = [];

async function createPromise(forBuild) {
  const modules = forBuild.map(x => x.name);
  const compileObjs = forBuild.map(
    x => require(x.webpackPath)(null, { mode: 'production' })[0]
  );
  const names = modules.map(x => x.replace('@nextgis/', '')).join(', ');
  process.stdout.write('start build ' + names + '\n');
  forBuild.forEach(async x => {
    return await new Promise(resolve => {
      rimraf(join(x.path, './lib'), resolve);
    });
  });
  return new Promise((resolve, reject) => {
    webpack(compileObjs, (err, stats) => {
      if (err || stats.hasErrors()) {
        process.stdout.write(stats.toString() + '\n');
        reject();
      }
      builded = builded.concat(modules);
      resolve();
    });
  });
}

function generate(source = './packages') {
  source = resolve(__dirname, source);
  const modules = {};

  readdirSync(source).forEach(name => {
    const libPath = join(source, name);

    // find packages
    if (isDirectory(libPath)) {
      const packagePath = join(libPath, 'package.json');
      if (existsSync(packagePath)) {
        const package = JSON.parse(readFileSync(packagePath, 'utf8'));
        if (!package.private) {
          const webpackPath = join(libPath, 'webpack.config.js');
          if (existsSync(webpackPath)) {
            const deps = package.dependencies
              ? Object.keys(package.dependencies).filter(
                  x => x.indexOf('@nextgis') !== -1
                )
              : [];
            modules[package.name] = {
              path: libPath,
              webpackPath,
              deps,
              name: package.name
            };
          }
        }
      }
    }
  });
  return modules;
}

async function createOrderedBuild() {
  while (builded.length < sortedKeys.length) {
    const forBuild = [];
    sortedKeys.forEach(s => {
      if (builded.indexOf(s) === -1) {
        const { node } = sorted.get(s);
        const canBuild =
          node.deps.length === 0 ||
          node.deps.filter(d => builded.indexOf(d) === -1).length === 0;
        if (canBuild) {
          forBuild.push(node);
        }
      }
    });
    await createPromise(forBuild);
  }
}
createOrderedBuild();
