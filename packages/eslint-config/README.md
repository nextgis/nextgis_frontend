# NextGIS config for Eslint

A Typescript and Javascript configuration for [ESLint](http://eslint.org/) used in NextGIS frontend projects.

## Install

All dependencies are already included in this library so you can not install them separately.
Just run the command:

```bash
npm i -D @nextgis/eslint-config
```

Then create the `eslint.config.js` in the root of your project and add the following content:

```javascript
import config from './packages/eslint-config/index.js';

export default config;
```

## Webpack

Install eslint loader for webpack

```bash
npm i -D eslint-loader
```

In your webpack configuration

```javascript
module.exports = {
  // ...
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.(t|j)sx?$/,
        loader: "eslint-loader",
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      },
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

```javascripton
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
