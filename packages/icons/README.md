# Icons

Svg icons pack

## Installation

### Using directly in the browser

#### Include assets

Simply download and include with a script tag. Icons will be registered as a global variable.

```html
<script src="../lib/icons.js"></script>

<script>
  var icon = Icon.getIcon(options);
</script>
```

#### CDN

```html
<script src="https://unpkg.com/@nextgis/icon"></script>
```

We recommend linking to a specific version number that you can update manually:

```html
<script src="https://unpkg.com/@nextgis/icon@0.7.0"></script>
```

### NPM

NPM is the recommended installation method when building large scale applications with Icons. It pairs nicely with module bundlers such as [Webpack](https://webpack.js.org/)

```bash
# latest stable
$ npm install @nextgis/dialog
```

```js
import { getIcon } from '@nextgis/icons';

const icon = getIcon(options);

```

## Commercial support

Need to fix a bug or add a feature to @nextgis/icons? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](http://nextgis.ru/img/nextgis.png)](http://nextgis.com)

