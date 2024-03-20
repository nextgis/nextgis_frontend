# Logging

![size](https://img.shields.io/bundlephobia/minzip/@nextgis/logging) ![version](https://img.shields.io/npm/v/@nextgis/logging)

Logging control

## Installation

### In Browser

#### Include assets

Simply download and include with a script tag, `Logging` will be registered as a global variable.

```html
<script src="../lib/logging.global.js"></script>

<script>
  const logging = new Logging();
</script>
```

#### CDN

unpkg

```html
<script src="https://unpkg.com/@nextgis/logging"></script>
```

jsdelivr

```html
<script src="https://cdn.jsdelivr.net/npm/@nextgis/logging"></script>
```

We recommend linking to a specific version number `/logging@[version]`

### In Node.js

```bash
npm install @nextgis/logging
```

## Usage

```javascript
import {Logging, NgLogEngine} from '@nextgis/logging';

const logger = new Logging({
  engines: [
    new NgLogEngine({
      clientId: 'f868a76b-2ec3-405d-b6a4-851bd228f8bf',
      delay: 1000
    }),
  ],
});
logger.info('Hello NextGIS!');

```

Check out the [API Documentation](https://code-api.nextgis.com/modules/logging.html)

## Commercial support

Need to fix a bug or add a feature to `@nextgis/logging`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
