import { expect } from 'chai';
import { mapHtml } from '../../helpers/mapHtml';

import NgwMap from '../../../packages/ngw-leaflet';
import { NgwWebmapLayerAdapter } from '@nextgis/ngw-kit';

let ngwMap!: NgwMap;

describe('NgwKit', function () {
  this.timeout(15000);

  beforeEach(async () => {
    document.documentElement.innerHTML = mapHtml;

    ngwMap = await NgwMap.create({
      target: 'map',
      baseUrl: 'https://demo.nextgis.com',
      resources: [{ resource: 6278, id: 'webmap', fit: true }],
    });
  });

  describe('Layer Tree and Properties', () => {
    let webMapLayer!: NgwWebmapLayerAdapter;

    beforeEach(async () => {
      webMapLayer = (await ngwMap.getLayer('webmap')) as NgwWebmapLayerAdapter;
      if (!webMapLayer) {
        throw new Error('Layer not found');
      }
    });

    it('hasLayerTree', async () => {
      const descendants = webMapLayer.layer!.tree.getDescendants();
      expect(descendants).to.be.an('array').and.to.have.length.greaterThan(0);
    });

    it('togglesLayerVisibility', async () => {
      const buildingsLayer = webMapLayer.layer!.tree.getDescendants(
        (x) => x.item.display_name === '2.5D Buildings',
      )[0];
      expect(buildingsLayer).to.exist;

      buildingsLayer.properties.set('visibility', false);
      expect(buildingsLayer.properties.get('visibility')).to.be.false;

      buildingsLayer.properties.set('visibility', true);
      expect(buildingsLayer.properties.get('visibility')).to.be.true;
    });

    it('setsLayerOpacity', async () => {
      const layer = webMapLayer.layer!.tree
        .getDescendants()
        .find((x) => x.item.item_type === 'layer');
      expect(layer).to.exist;
      layer!.properties.set('opacity', 0.5);
      expect(layer!.properties.get('opacity')).to.equal(0.5);
    });

    it('validatesLayerTypes', async () => {
      const rootItem = webMapLayer.layer!.item;
      expect(rootItem.item_type).to.equal('root');

      const items = webMapLayer.layer!.tree.getDescendants();

      const groupItem = items.find((x) => x.item.item_type === 'group')!.item;
      if (groupItem.item_type === 'group') {
        expect(groupItem.children).to.be.an('array');
      }
      expect(groupItem.item_type).to.equal('group');

      const layerItem = items.find((x) => x.item.item_type === 'layer')!.item;
      if (layerItem.item_type === 'layer') {
        expect(layerItem.layer_style_id).to.be.a('number');
      }
      expect(layerItem.item_type).to.equal('layer');
    });
  });
});
