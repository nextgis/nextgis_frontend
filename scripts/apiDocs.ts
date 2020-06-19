import {
  Extractor,
  ExtractorConfig,
  ExtractorLogLevel,
} from '@microsoft/api-extractor';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const reportFolder = path.resolve('input');
const reportTempFolder = path.resolve('temp');

const rimraf = require('rimraf');

async function main() {
  fs.mkdirSync(reportFolder, {
    recursive: true,
  });

  fs.mkdirSync(reportTempFolder, {
    recursive: true,
  });

  const workspaces = JSON.parse(
    execSync('yarn workspaces --silent info').toString()
  );

  const skipPackages: string[] = [
    // support
    '@nextgis/build-tools',
    '@nextgis/eslint-config',
    '@nextgis/demo',
    '@nextgis/demo-app',
    // map adapters
    '@nextgis/leaflet-map-adapter',
    '@nextgis/mapbox-map-adapter',
    '@nextgis/ol-map-adapter',
    '@nextgis/ngw-orm',
    '@nextgis/cesium-map-adapter',
    '@nextgis/ngw-leaflet',
    '@nextgis/ngw-ol',
    '@nextgis/ngw-mapbox',
    '@nextgis/ngw-cesium',
    // vue
    '@nextgis/vuex-ngw',
    '@nextgis/vuetify-ngw-components',
    '@nextgis/vue-ngw-ol',
    '@nextgis/vue-ngw-mapbox',
    '@nextgis/vue-ngw-map',
    '@nextgis/vue-ngw-leaflet',
  ];

  const packages = Object.keys(workspaces).filter(
    (p) => !skipPackages.includes(p)
  );
  for (const packageName of packages) {
    await extractPkg(packageName);
  }

  // tslint:disable-next-line: no-console
  console.log(execSync('yarn docs:md').toString());
}

async function extractPkg(packageName: string) {
  const libPath = `packages${packageName.replace('@nextgis', '')}`;
  const dist = path.resolve(libPath, 'lib');
  const packagePath = `${libPath}/package.json`;
  const packageJson = require(`../${packagePath}`) as any;
  const packageJsonFullPath = path.resolve(`${packagePath}`);
  const untrimmedFilePath = path.resolve(`${libPath}/lib/dtsRollup/index.d.ts`);

  const config = ExtractorConfig.prepare({
    packageJson,
    packageJsonFullPath,
    configObjectFullPath: path.resolve(`${libPath}`),
    configObject: {
      projectFolder: path.resolve(libPath),
      mainEntryPointFilePath: path.resolve(`${libPath}/lib/index.d.ts`),
      compiler: {
        tsconfigFilePath: path.resolve(`${libPath}/tsconfig.json`),
      },
      docModel: {
        enabled: true,
        apiJsonFilePath: `${reportFolder}/<unscopedPackageName>.api.json`,
      },
      tsdocMetadata: {
        enabled: false,
      },
      dtsRollup: {
        enabled: true,
        untrimmedFilePath,
      },
      apiReport: {
        enabled: true,
        reportFolder,
        reportTempFolder,
        reportFileName: '<unscopedPackageName>.api.md',
      },
      messages: {
        extractorMessageReporting: {
          'ae-missing-release-tag': {
            logLevel: ExtractorLogLevel.None,
          },
        },
      },
    },
  });

  const result = Extractor.invoke(config, {
    localBuild: true,
    messageCallback: (message) => {
      let loc = '';
      if (message.sourceFilePath !== undefined) {
        loc += `${message.sourceFilePath}:`;
        if (message.sourceFileLine !== undefined) {
          loc += `${message.sourceFileLine}:`;
          if (message.sourceFileColumn !== undefined) {
            loc += `${message.sourceFileColumn}:`;
          }
        }
        loc += ' ';
      }
      console.warn(
        `${loc}(${message.category}) ${message.text} (${message.messageId})`
      );
    },
  });
  if (!result.succeeded) {
    throw new Error(`failed to extract api when processing '${packageName}'`);
  }

  const dtsRollupExist = path.resolve(dist, 'dtsRollup');
  if (fs.existsSync(dtsRollupExist)) {
    const typesPath = path.resolve(libPath, packageJson.types);
    fs.renameSync(untrimmedFilePath, typesPath);

    const typeFiles = fs.readdirSync(dist);
    typeFiles.forEach((x) => {
      const filePath = path.resolve(dist, x);
      const mainPath = path.resolve(libPath, packageJson.main);
      if (filePath !== typesPath && filePath !== mainPath) {
        rimraf.sync(filePath);
      }
    });
  }
}

main();
