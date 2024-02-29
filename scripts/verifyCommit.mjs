// @ts-check
import { readFileSync } from 'node:fs';

import chalk from 'chalk';

/**
 * @param {import("fs").PathOrFileDescriptor} msgPath
 */
function readCommitMessage(msgPath) {
  return readFileSync(msgPath, 'utf-8').trim();
}

/**
 * @param {string} msg
 */
function isValidCommitMessage(msg) {
  const commitRE =
    // eslint-disable-next-line max-len
    /^(revert: )?(feat|fix|docs|style|refactor|perf|test|workflow|build|ci|chore|types|wip|release)(\(.+\))?: .{1,50}/;
  return commitRE.test(msg);
}

function logCommitMessageError() {
  console.log();
  console.error(
    `  ${chalk.bgRed.white(' ERROR ')} ${chalk.red(
      `invalid commit message format.`,
    )}\n\n` +
      chalk.red(
        `  Proper commit message format is required for automated changelog generation. Examples:\n\n`,
      ) +
      `    ${chalk.green(`feat(webmap): add 'minZoom' option`)}\n` +
      `    ${chalk.green(
        `fix(leaflet-map-adapter): set layer opacity (close #13)`,
      )}\n\n` +
      chalk.red(`  See .github/commit-convention.md for more details.\n`),
  );
}

const msgPath = process.env.GIT_PARAMS;
const msg = msgPath && readCommitMessage(msgPath);

if (!msg || !isValidCommitMessage(msg)) {
  logCommitMessageError();
  process.exit(1);
}
