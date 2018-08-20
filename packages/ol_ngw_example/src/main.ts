import { WebMap } from '../../webmap/src/entities/WebMap';
import { OlMapAdapter } from '../../ol-map-adapter/src/OlMapAdapter';
import { NgwKit } from '../../ngw-kit/src/NgwKit';

// import { WebMap } from '@ngw-front/webmap';
// import { OlMapAdapter } from '@ngw-front/ol-map-adapter';
// import { NgwKit } from '@ngw-front/ngw-kit';

// import {}
const webMap = new WebMap({
  mapAdapter: new OlMapAdapter(),
  starterKits: [new NgwKit()],
});

webMap.create({
  target: 'map'
});

