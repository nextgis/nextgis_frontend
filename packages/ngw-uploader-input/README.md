# Ngw Uploader Input

Library for simplifying uploading data to the NGW cloud from the browser

## Installation

### In Browser

#### Include assets

Simply download and include with a script tag. `NgwUploaderInput` will be registered as a global variable.

```html
<script src="../lib/ngw-uploader.global.prod.js"></script>
<div id='uploader'></div>
<script>
  var uploader = document.getElementById('uploader');
  var ngwUploader = new NgwUploader({
      baseUrl: 'https://sandbox.nextgis.com'
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

### In Node.js

NPM is the recommended installation method when building large scale applications with NgwUploader. It pairs nicely with module bundlers such as [Webpack](https://webpack.js.org/)

```bash
# latest stable
$ npm install @nextgis/ngw-uploader-input
```

```javascript
import NgwUploader from '@nextgis/ngw-uploader-input';

const ngwUploader = new NgwUploader({
    baseUrl: 'https://sandbox.nextgis.com'
});

```

## Commercial support

Need to fix a bug or add a feature to `@nextgis/ngw-uploader-input`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.ru/img/nextgis.png)](http://nextgis.com)
