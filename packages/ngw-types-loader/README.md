# NGW Types Loader

![size](https://img.shields.io/bundlephobia/minzip/@nextgis/ngw-types-loader) ![version](https://img.shields.io/npm/v/@nextgis/ngw-types-loader)

A CLI tool that downloads TypeScript declarations from NextGIS Web and installs them as resolvable packages.

## Installation

```bash
npm install @nextgis/ngw-types-loader
```

## Usage

Run the loader without installing it:

```bash
npx @nextgis/ngw-types-loader
```

For a custom NextGIS Web deployment:

```bash
npx @nextgis/ngw-types-loader https://your-ngw-server.com
```

If the loader is installed in the project, you can use its executable directly.
By default, the loader downloads declarations from `https://demo.nextgis.com`:

```bash
ngw-types-loader
```

For a custom NextGIS Web deployment, pass its URL:

```bash
ngw-types-loader https://your-ngw-server.com
```

The declarations are installed under `node_modules/@nextgisweb`. Imports such as
`@nextgisweb/resource/type/api` are resolved by TypeScript without adding a generated
file to `tsconfig.json`.

Run the loader from `postinstall` when the declarations should be regenerated after
installing dependencies:

```json
{
  "scripts": {
    "postinstall": "ngw-types-loader"
  }
}
```

Use the URL of your own server when its installed components or version differ from
NextGIS Cloud.

## API documentation

See the [NextGIS Web API documentation](https://demo.nextgis.com/doc/api).

## Commercial support

Need help with `@nextgis/ngw-types-loader`? [Contact NextGIS](http://nextgis.com/contact/).
