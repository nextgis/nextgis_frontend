/**
 * This node script allow to generate actual index.js and index.d.ts files for current api version
 */
const NgwConnector = require('@nextgis/ngw-connector');
const args = require('minimist')(process.argv.slice(2));
// TODO: use something like https://api.nextgis.com to get all available data
//       from current version on installed NGW Server API
let baseUrl = 'https://demo.nextgis.com';

const typePath = 'src/types/RequestItemsParamsMap.ts';

if (args.url || args.u) {
  baseUrl = args.url || args.u;
}

const connector = new NgwConnector({ baseUrl });

connector.connect().then((router) => {
  generateTypes(router);
});

function generateTypes(router) {
  let stop = false;
  const newLines = [];
  readLines(
    typePath,
    (line) => {
      if (!stop) {
        stop = line.indexOf('==./scripts/generator.js==') !== -1;
        newLines.push(line);
      }
    },
    () => {
      insertRequestItemsParamsMap(newLines, router);
      require('fs').writeFile(typePath, '', () =>
        writeLines(typePath, newLines),
      );
    },
  );
}

function insertRequestItemsParamsMap(lines, routers) {
  lines.push('export interface RequestItemsParamsMap {');
  for (var r in routers) {
    const router = routers[r];
    const params = router.slice(1, router.length);
    let line = `  '${r}'`;
    if (params && params.length) {
      line += ': { ';
      // TODO: get type of parameter; until everything is a number
      line += params.map((p) => `${p}: number`).join(', ');
      line += ' };';
    } else {
      line += ': null;';
    }
    lines.push(line);
  }
  // lines.push('  [x: string]: {[x: string]: any};');
  lines.push('}');
}

function readLines(file, lineCb, closeCb) {
  const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(file),
  });
  lineReader.on('line', lineCb);
  lineReader.on('close', closeCb);
}

function writeLines(file, lines) {
  var fs = require('fs');
  const text = lines.join('\r\n');
  fs.appendFile(file, text, function (err) {
    if (err) {
      return console.log(err);
    } else {
      console.log('The ' + file + ' was saved!');
    }
  });
}
