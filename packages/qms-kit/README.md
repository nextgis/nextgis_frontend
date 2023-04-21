# Qms kit

![size](https://img.shields.io/bundlephobia/minzip/@nextgis/qms-kit) ![version](https://img.shields.io/npm/v/@nextgis/qms-kit)

Build webmap with [QuickMapServices](https://qms.nextgis.com/) baselayers.

## Usage

### Use with webmap starter kit

```js
import { WebMap } from '@nextgis/webmap';
import { QmsKit } from '@nextgis/qms-kit';
import LeafletMapAdapter from '@nextgis/leaflet-map-adapter';


const webMap = new WebMap({
    mapAdapter: new LeafletMapAdapter(),
    starterKits: [new QmsKit()],
});

webMap.addBaseLayer('QMS', { qmsId: 3335 });
```

### Use with createQmsAdapter function

```js
import { WebMap } from '@nextgis/webmap';
import { createQmsAdapter } from '@nextgis/qms-kit';
import LeafletMapAdapter from '@nextgis/leaflet-map-adapter';


const webMap = new WebMap({
    mapAdapter: new LeafletMapAdapter(),
});

webMap.addBaseLayer(createQmsAdapter({ webMap, qmsId: 3335 }));
```

[![http://nextgis.com](https://nextgis.ru/img/nextgis.png)](http://nextgis.com)
