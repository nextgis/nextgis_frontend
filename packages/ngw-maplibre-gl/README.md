# NgwMaplibreGL

![size](https://img.shields.io/bundlephobia/minzip/@nextgis/ngw-maplibre-gl) ![version](https://img.shields.io/npm/v/@nextgis/ngw-maplibre-gl)

Browser bundle for rapid deployment of [Maplibre GL JS](https://maplibre.org/maplibre-gl-js/docs/) based web-gis applications with NextGIS services.

Styles and images are included in the bundle. MapLibre GL JS 6 also requires
worker modules for processing GeoJSON and vector tiles.

## Installation

### In Browser

#### Include browser files

Keep `maplibre-gl-worker.mjs` and `maplibre-gl-shared.mjs` next to the browser
bundle. They are copied to `lib` during the package build. `NgwMaplibreGL` and
`NgwMap` will be registered as global variables.

```text
lib/
├── ngw-maplibre-gl.global.prod.js
├── maplibre-gl-worker.mjs
└── maplibre-gl-shared.mjs
```

```html
<script src="../lib/ngw-maplibre-gl.global.prod.js"></script>

<div id="map"></div>
<script>
  // const ngwMap = new NgwMaplibreGL({
  const ngwMap = new NgwMap({
    baseUrl: 'https://demo.nextgis.com',
    target: 'map',
    qmsId: 448,
    webmapId: 3985,
  });
</script>
```

#### CDN

unpkg

```html
<script src="https://unpkg.com/@nextgis/ngw-maplibre-gl@VERSION/lib/ngw-maplibre-gl.global.prod.js"></script>
```

jsdelivr

```html
<script src="https://cdn.jsdelivr.net/npm/@nextgis/ngw-maplibre-gl@VERSION/lib/ngw-maplibre-gl.global.prod.js"></script>
```

The explicit bundle path is required so MapLibre can resolve the worker modules
from the same `lib` directory. Replace `VERSION` with a specific package
version. When a strict Content Security Policy is enabled for a cross-origin
CDN, follow the `worker-src` guidance in the migration guide linked below.

### In Node.js

```bash
npm install maplibre-gl @nextgis/ngw-maplibre-gl
```

### MapLibre GL JS 6 worker

The `esm-bundler` build leaves MapLibre as a peer dependency, so the final
application bundler must provide the worker URL before creating a map.

For Vite, use its worker pipeline so the worker and its shared module are emitted
together:

```ts
import { setWorkerUrl } from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';

setWorkerUrl(workerUrl);
```

For other bundlers, copy both `maplibre-gl-worker.mjs` and
`maplibre-gl-shared.mjs` from `maplibre-gl/dist` to the same public directory,
then configure the URL:

```ts
import { setWorkerUrl } from 'maplibre-gl';

setWorkerUrl('/maplibre/maplibre-gl-worker.mjs');
```

See the official MapLibre documentation:

- [ESM and bundler setup](https://github.com/maplibre/maplibre-gl-js/blob/main/docs/index.md#esm)
- [MapLibre GL JS 5 to 6 migration guide](https://maplibre.org/maplibre-gl-js/docs/guides/v5-to-v6-migration-guide/)
- [`setWorkerUrl()` API](https://maplibre.org/maplibre-gl-js/docs/API/functions/setWorkerUrl/)

## Usage

```javascript
import NgwMap from '@nextgis/ngw-maplibre-gl';

const ngwMap = new NgwMap({
  baseUrl: 'https://demo.nextgis.com',
  target: 'map',
  qmsId: 448,
  webmapId: 3985,
});
```

Check out the [API Documentation](https://code-api.nextgis.com/modules/_nextgis_ngw_maplibre_gl.html)

## Commercial support

Need to fix a bug or add a feature to `@nextgis/ngw-maplibre-gl`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
