# Ngw Connector

Module for interaction with [NextGIS Web](http://docs.nextgis.ru/docs_ngweb_dev/doc/developer/toc.html) REST API.

## Installation

### Using directly in the browser

#### Include assets

Simply download and include with a script tag. NgwConnector will be registered as a global variable.

```html
<script src="../lib/ngw-connector.js"></script>

<script>
  var ngwConnector = new NgwConnector({
    baseUrl: 'https://demo.nextgis.com',
  });
</script>
```

#### CDN

```html
<script src="https://unpkg.com/@nextgis/ngw-connector"></script>
```

We recommend linking to a specific version number that you can update manually:

```html
<script src="https://unpkg.com/@nextgis/ngw-connector@0.19.0"></script>
```

### NPM

NPM is the recommended installation method when building large scale applications with NgwConnector. It pairs nicely with module bundlers such as [Webpack](https://webpack.js.org/)

```bash
# latest stable
$ npm install --save-dev @nextgis/ngw-connector
# or
$ yarn add @nextgis/ngw-connector
```

```js
import NgwConnector from '@nextgis/ngw-connector';

const ngwConnector = new NgwConnector({
  baseUrl: 'https://demo.nextgis.com'
});

ngwConnector.get('resource.item', null, { id: 485 }).then((data) => {
  console.log(data);
});

```

## Generate code for a specific API version

```bash
node ./scripts/generate -u [NGW_SERVER_API_URL]
# or
npm run gen -- -u [NGW_SERVER_API_URL]
```

Run without params to get current version of base NGW SERVER API

## Commercial support

Need to fix a bug or add a feature to `@nextgis/ngw-connector`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](http://nextgis.ru/img/nextgis.png)](http://nextgis.com)
