# Dialog

Modal window management

## Installation

### Using directly in the browser

#### Include assets

Simply download and include with a script tag. Dialog will be registered as a global variable.

```html
<script src="../lib/dialog.js"></script>

<script>
  var dialog = new Dialog();
</script>
```

#### CDN

```html
<script src="https://unpkg.com/@nextgis/dialog"></script>
```

We recommend linking to a specific version number that you can update manually:

```html
<script src="https://unpkg.com/@nextgis/dialog@0.19.0"></script>
```

### NPM

NPM is the recommended installation method when building large scale applications with Dialog. It pairs nicely with module bundlers such as [Webpack](https://webpack.js.org/)

```bash
# latest stable
$ npm install @nextgis/dialog
```

```js
import Dialog from '@nextgis/dialog';

const dialog = new Dialog();
dialog.updateContent('Hello world');
dialog.show();

```

## Commercial support

Need to fix a bug or add a feature to @nextgis/dialog? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](http://nextgis.ru/img/nextgis.png)](http://nextgis.com)

