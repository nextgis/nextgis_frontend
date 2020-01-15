const webpack = require('webpack');
// const rimraf = require('rimraf');
const path = require('path');
const chalk = require('chalk');

const args = require('minimist')(process.argv.slice(2));
const mode = args.mode || args.m || 'development';
const progress = args.progress || args.p;

const dirname = process.cwd();

// const name = path.basename(packagesDir);
const resolve = p => path.resolve(dirname, p);
const package = require(resolve(`package.json`));
const packageOptions = package.buildOptions || {};

const library = packageOptions.name;
const externals = !!packageOptions.externals;

const common = require('../../build/webpack.config');

if (!library) {
  console.error(
    chalk.red(
      `Need to set library name option 'packageOptions.name' in 'packages.json' `
    )
  );
  process.exitCode = 1;
}

const config = common(
  process.env,
  { mode },
  {
    library,
    package,
    libraryExport: '',
    externals,
    dirname
  }
);

function run() {
  const compiler = webpack(config);
  console.log(chalk.gray(`${library} - start ${mode} build`));
  compiler.run((err, stats) => {
    if (err || stats.hasErrors()) {
      console.log(chalk.red(`${library} - error`));
      process.stdout.write(stats.toString() + '\n');
      process.exitCode = 1;
    } else {
      console.log(chalk.green(`${library} - success`));
    }
  });
}

run();
