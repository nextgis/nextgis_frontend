# ngw_frontend

This repository under construction

## For developers

### Instruction for whole repository

    // Clone git through ssh
    git clone git@github.com:nextgis/nextgisweb_frontend.git
    cd ./nextgisweb_frontend
    // Install yarn and lerna global
    npm i -g yarn lerna
    // Install dependencies
    yarn install
    // Prepare packages
    lerna bootstrap
    // Build all packages
    lerna run build

### Instruction for each packages

    // Go to package directory (for example webmap)
    cd ./packages/webmap
    // Run build command
    yarn run build
    // Run watch source files changes command
    yarn run watch

### Publishing

To publish new version to git and npm run

    lerna publish

When publishing, you will need to select a new version number. It is the same for all libraries.
Dependencies between packages are solved automatically.

To publish a new package, run the following command in the package folder

    npm publish --access=public

### Troubleshoot

Sometimes there are problems of establishing dependencies between librariesю
Аor example, between the ngw-kit and the ngw-connector).
In this case, you need to execute commands from root directory

    rm -rf ./node_modules
    // or
    del ./node_modules // for Windows
    lerna clean
    lerna bootstrap

---

During the publication, an error may occur if the git is not connected via ssh, but via http[s]

---

VSCode

[Bug](https://github.com/Microsoft/vscode/issues/25312) Wen not finding symbolyc linked modules try to

1. CTRL + SHIFT + P & equivalent for MacOS (brings up the command palette)
2. Search something like "typescript"
3. Select TypeScript: Restart TS server

---

### Helpful information

Some [lerna+yarn instruction](https://medium.com/trabe/monorepo-setup-with-lerna-and-yarn-workspaces-5d747d7c0e91)

Usefull VSCode plugins:

- Typescript MonoRepo Import Fixer
