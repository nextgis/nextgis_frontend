const chalk = require('chalk');
const checkBuild = require('./testBuild');

const notValid = Object.entries(checkBuild());
if (notValid.length) {
  console.error(
    `${chalk.bgRed.white(' ERROR ')} ${chalk.red(
      `invalid build for packages:`
    )}\n\n` + chalk.red(`${notValid.map((x) => x.join(', ')).join('\n')}`)
  );
  process.exit(1);
} else {
  console.log(chalk.green('No build error'));
}
