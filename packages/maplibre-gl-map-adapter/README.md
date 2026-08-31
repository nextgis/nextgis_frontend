# Maplibre GL JS map adapter

![version](https://img.shields.io/npm/v/@nextgis/maplibre-gl-map-adapter)

Webmap adapter to use [Maplibre GL JS](https://maplibre.org/maplibre-gl-js/docs/) framework.

This library is not intended for using directly in the browser.

Use MaplibreGLMapAdapter with NPM installation method for building large scale applications. It pairs nicely with module bundlers such as [Webpack](https://webpack.js.org/)

```bash
# latest stable
npm install maplibre-gl @nextgis/maplibre-gl-map-adapter
```

```javascript
import { WebMap } from '@nextgis/webmap';
import MaplibreGLMapAdapter from '@nextgis/maplibre-gl-map-adapter';
// manually added styles

const webMap = new WebMap({
  mapAdapter: new MaplibreGLMapAdapter(),
});

webMap.create(options).then(() => {
  // on webmap create
});
```

## MapLibre GL JS 6 worker

MapLibre GL JS 6 uses a module worker to process GeoJSON and vector tiles. The
worker must be configured by the final application bundler before creating a
map.

For Vite:

```ts
import { setWorkerUrl } from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';

setWorkerUrl(workerUrl);
```

For a manually deployed worker, copy both `maplibre-gl-worker.mjs` and
`maplibre-gl-shared.mjs` from `maplibre-gl/dist` to the same public directory:

```ts
import { setWorkerUrl } from 'maplibre-gl';

setWorkerUrl('/maplibre/maplibre-gl-worker.mjs');
```

Bundler-specific instructions and migration details are available in the
official documentation:

- [ESM and bundler setup](https://github.com/maplibre/maplibre-gl-js/blob/main/docs/index.md#esm)
- [MapLibre GL JS 5 to 6 migration guide](https://maplibre.org/maplibre-gl-js/docs/guides/v5-to-v6-migration-guide/)
- [`setWorkerUrl()` API](https://maplibre.org/maplibre-gl-js/docs/API/functions/setWorkerUrl/)

## Commercial support

Need to fix a bug or add a feature to @nextgis/maplibre-gl-map-adapter? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
