# NextGIS config for Eslint

A Typescript and Javascript configuration for [ESLint](http://eslint.org/) used in NextGIS frontend projects.

## Install

All dependencies are already included in this library so you can not install them separately.
Just run the command:

```bash
npm i -D @nextgis/eslint-config
```

Or

```bash
yarn add -D @nextgis/eslint-config
```

Then create the `.eslintrc` in the root of your project and add the following content:

```json
{
  "extends": [
    "@nextgis/eslint-config"
  ]
}
```

## Webpack

Install eslint loader for webpack

```bash
npm i -D eslint-loader
```

Or

```bash
yarn add -D eslint-loader
```

In your webpack configuration

```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader"
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  }
  // ...
};
```

## VSCode

To properly set up the environment for checking and automatically fixes *.ts files, follow these steps:

- Install VSCode ESLint extension from [site](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) or from plugin manager;

- Configure project to work with typescript files

Open VSCode `File > Preferences > Settings` JSON view

Or create config file manual:

```bash
mkdir .vscode && touch .vscode/settings.json
```

and add this to config:

```json
  "editor.formatOnSave": true,
  "eslint.autoFixOnSave": true,
  "eslint.validate": [
    {
      "language": "javascript",
      "autoFix": true
    },
    {
      "language": "javascriptreact",
      "autoFix": true
    },
    {
      "language": "typescript",
      "autoFix": true
    },
    {
      "language": "typescriptreact",
      "autoFix": true
    }
  ],
  "tslint.enable": false
```
