# Ngw Uploader

Library providing tools for uploading data to the NGW cloud

## Installation

### Using directly in the browser

#### Include assets

Simply download and include with a script tag. NgwLeaflet will be registered as a global variable.

```html
<script src="../lib/ngw-uploader.js"></script>
<div id='uploader'></div>
<script>
  var uploader = document.getElementById('uploader');
  var ngwUploader = new NgwUploader({
      baseUrl: 'http://dev.nextgis.com/sandbox'
  });
  const input = ngwUploader.createInput();
  uploader.appendChild(input);
</script>
```

#### CDN

```html
<script src="https://unpkg.com/@nextgis/ngw-uploader"></script>
```

We recommend linking to a specific version number that you can update manually:

```html
<script src="https://unpkg.com/@nextgis/ngw-uploader@0.19.0"></script>
```

### NPM

NPM is the recommended installation method when building large scale applications with NgwUploader. It pairs nicely with module bundlers such as [Webpack](https://webpack.js.org/)

```bash
# latest stable
$ npm install @nextgis/ngw-uploader
```

```js
import NgwLeaflet from '@nextgis/ngw-uploader';

const ngwLeaflet = new NgwUploader({
    baseUrl: 'http://dev.nextgis.com/sandbox'
});

```

## Commercial support

Need to fix a bug or add a feature to `@nextgis/ngw-uploader`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](http://nextgis.ru/img/nextgis.png)](http://nextgis.com)
