# NGW Types Loader

![size](https://img.shields.io/bundlephobia/minzip/@nextgis/ngw-types-loader) ![version](https://img.shields.io/npm/v/@nextgis/ngw-types-loader)

A CLI tool that downloads TypeScript declarations from a NextGIS Web
deployment and installs them as resolvable packages. Use it when consuming the
typed `NgwConnector.route()` API or other declarations that import
`@nextgisweb/*` modules.

## Installation

```bash
npm install --save-dev @nextgis/ngw-types-loader
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

Package managers and deployment environments may skip lifecycle scripts. Keep
the explicit `npx @nextgis/ngw-types-loader ...` command in project setup and
CI documentation even when `postinstall` is configured.

Use the URL of your own server when its installed components or version differ from
NextGIS Cloud.

Run the loader again after changing the NextGIS Web version, installed
components or extensions, or after recreating `node_modules`.

## API documentation

See the [NextGIS Web API documentation](https://demo.nextgis.com/doc/api).

See also the [package architecture guide](../../docs/PACKAGES.md).

## Commercial support

Need help with `@nextgis/ngw-types-loader`? [Contact NextGIS](http://nextgis.com/contact/).
