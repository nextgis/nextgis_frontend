# NgwConnector

![size](https://img.shields.io/bundlephobia/minzip/@nextgis/ngw-connector) ![version](https://img.shields.io/npm/v/@nextgis/ngw-connector)

A lightweight HTTP client optimized for use with [NextGIS Web](http://docs.nextgis.com/docs_ngweb_dev/doc/developer/toc.html) API.

Make sure CORS is registered in the [NextGIS Web settings](https://docs.nextgis.com/docs_ngcom/source/CORS.html) to be able to send requests.

## Installation

### In Browser

#### Include assets

Simply download and include with a script tag, `NgwConnector` will be registered as a global variable.

```html
<script src="../lib/ngw-connector.global.js"></script>

<script>
  var ngwConnector = new NgwConnector({
    baseUrl: 'https://demo.nextgis.com',
  });
</script>
```

#### CDN

unpkg

```html
<script src="https://unpkg.com/@nextgis/ngw-connector"></script>
```

jsdelivr

```html
<script src="https://cdn.jsdelivr.net/npm/@nextgis/ngw-connector"></script>
```

We recommend linking to a specific version number `/ngw-connector@[version]`

### In Node.js

```bash
npm install @nextgis/ngw-connector
```

## TypeScript Support

If you plan to use this library in a TypeScript project, it's recommended to install TypeScript declaration files for NextGIS Web by using the `@nextgis/ngw-types-loader` tool.

### Installing NGW Types

Run the following command to download the latest TypeScript declaration files:

```bash
npx @nextgis/ngw-types-loader
```

This will download the declaration file from the default NextGIS Web instance (`https://demo.nextgis.com`) and update your `tsconfig.json` to include it.

If you are using a custom NextGIS Web deployment, you can specify the URL:

```bash
npx @nextgis/ngw-types-loader https://your-custom-ngw-url.com
```

After running the tool, ensure that your `tsconfig.json` includes the downloaded file:

```json
{
  "include": [
    "./nextgisweb.d.ts"
  ]
}
```

For more details, refer to the [NGW Types Loader](https://www.npmjs.com/package/@nextgis/ngw-types-loader).

## Usage

```javascript
import NgwConnector from '@nextgis/ngw-connector';

const ngwConnector = new NgwConnector({
  baseUrl: 'https://demo.nextgis.com',
  // auth: {login, password}
});

ngwConnector
  .route('resource.item', { id: 485 })
  .get()
  .then((data) => {
    console.log(data);
  });

ngwConnector.route('resource.collection').patch({ json: RESOURCE });
ngwConnector.route('feature_layer.feature.collection', { id }).patch({
  json: ITEMS,
  query: {
    srs: 4326,
    geom_format: 'geojson',
  },
});
ngwConnector
  .route('feature_layer.feature.item', { id, fid })
  .put({ json: ITEM });
ngwConnector.route('feature_layer.feature.item', { id, fid }).delete();

// Shortcuts methods to find resources
ngwConnector.getResource(2011); // by id
ngwConnector.getResource('keyname'); // by keyname

ngwConnector.getResources({ cls: 'vector_layer', parent__id: 0 }); // find resources by partial resource params
ngwConnector.getResource({ display_name: 'My layer', parent__id: 0 }); // get first
```

Check out the [API Documentation](https://code-api.nextgis.com/modules/_nextgis_ngw_connector.html)

## NGW API

[NextGIS Web API Doc](http://docs.nextgis.com/docs_ngweb_dev/doc/developer/toc.html)

```javascript
ngwConnector.get(request_name, request_options, arguments);
```

[request_options](https://code-api.nextgis.com/interfaces/ngw_connector.RequestOptions.html)

[API request names](https://demo.nextgis.com/doc/api)

## Commercial support

Need to fix a bug or add a feature to `@nextgis/ngw-connector`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
