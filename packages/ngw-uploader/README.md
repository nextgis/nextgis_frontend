# Ngw Uploader

![size](https://img.shields.io/bundlephobia/minzip/@nextgis/ngw-uploader) ![version](https://img.shields.io/npm/v/@nextgis/ngw-uploader)

Library providing tools for uploading data to the NextGIS Web

## Installation

### In Browser

#### Include assets

Simply download and include with a script tag. `NgwUploader` will be registered as a global variable.

```html
<script src="../lib/ngw-uploader.global.prod.js"></script>

<script>
  const ngwUploader = new NgwUploader({
    baseUrl: 'https://sandbox.nextgis.com',
  });
</script>
```

#### CDN

```html
<script src="https://unpkg.com/@nextgis/ngw-uploader"></script>
```

We recommend linking to a specific version number that you can update manually:

```html
<script src="https://unpkg.com/@nextgis/ngw-uploader@[verion]"></script>
```

### In Node.js

NPM is the recommended installation method when building large scale applications with NgwUploader. It pairs nicely with module bundlers such as [Webpack](https://webpack.js.org/)

```bash
# latest stable
$ npm install @nextgis/ngw-uploader
```

```javascript
import NgwUploader from '@nextgis/ngw-uploader';

const ngwUploader = new NgwUploader({
  baseUrl: 'https://sandbox.nextgis.com',
});
ngwUploader.uploadVector(File, { parentId, pain });
ngwUploader.uploadRaster(File, { parentId });
```

## Commercial support

Need to fix a bug or add a feature to `@nextgis/ngw-uploader`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.ru/img/nextgis.png)](http://nextgis.com)
