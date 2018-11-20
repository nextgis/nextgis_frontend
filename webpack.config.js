const { join, resolve } = require('path');
const { lstatSync, readdirSync, readFileSync, existsSync } = require('fs');
const webpack = require("webpack");
const { TopologicalSort } = require('topological-sort');

const isDirectory = (source) => lstatSync(source).isDirectory();

const modules = generate();

const moduleMaps = Object.keys(modules).map((m) => [m, modules[m]]);
const sortOp = new TopologicalSort(new Map(moduleMaps));

for (const m in modules) {
  const module = modules[m];
  if (module.deps.length) {
    module.deps.forEach((d) => {
      sortOp.addEdge(d, m);
    });
  }
}
const sorted = sortOp.sort();
// const sortedKeys = ['@nextgis/webmap'];
const sortedKeys = [...sorted.keys()];

const configs = sortedKeys.map((x) => require(modules[x].path));
const compilers = configs.map((x) => x(null, { mode: 'production' })[0]);

const compiler = webpack(compilers, (err, stats) => {
  if (err || stats.hasErrors()) {
    // Handle errors here
  }
  process.stdout.write(stats.toString() + "\n");
});

// TODO: make parallel-webpack. https://webpack.js.org/api/node/#multicompiler
// const builded = [];
// async function createOrderedBuild() {

//   while (sortedKeys) {
//     const compilers = [];
//     sortedKeys.forEach((s) => {
//       const { node, children } = sorted.get(s);
//       const canBuild = node.deps.length === 0 || node.deps.filter((d) => builded.indexOf(d) !== -1).length === 0;
//       if (canBuild) {
//         compilers.push(require(node.path)(null, { mode: 'production' })[0]);
//       }
//     })

//     await new Promise((resolve) => {
//       console.log('start build ', compilers);
//       webpack(compilers, (err, stats) => {
//         process.stdout.write(stats.toString() + "\n");
//       });
//     })
//   }
// }
// createOrderedBuild();


function generate(source = './packages') {
  source = resolve(__dirname, source);
  const modules = {};

  readdirSync(source).forEach((name) => {
    const libPath = join(source, name);

    // find packages
    if (isDirectory(libPath)) {
      const packagePath = join(libPath, 'package.json');
      if (existsSync(packagePath)) {
        const package = JSON.parse(readFileSync(packagePath, 'utf8'));
        if (!package.private) {
          const webpackPath = join(libPath, 'webpack.config.js');
          if (existsSync(webpackPath)) {
            const deps = package.dependencies ?
              Object.keys(package.dependencies).filter((x) => x.indexOf('@nextgis') !== -1)
              : [];
            modules[package.name] = {
              path: webpackPath,
              deps,
            };
          }
        }
      }
    }
  });
  return modules;
}
