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
      resources: [{ resource: 7120, id: 'webmap', fit: true }],
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
      const landAreaLayer = webMapLayer.layer!.tree.getDescendants(
        (x) => x.item.display_name === 'Land area',
      )[0];
      expect(landAreaLayer).to.exist;

      landAreaLayer.properties.set('visibility', false);
      expect(landAreaLayer.properties.get('visibility')).to.be.false;

      landAreaLayer.properties.set('visibility', true);
      expect(landAreaLayer.properties.get('visibility')).to.be.true;
    });

    it('setsLayerOpacity', async () => {
      const layer = webMapLayer.layer!.tree.getDescendants()[0];
      layer.properties.set('opacity', 0.5);
      expect(layer.properties.get('opacity')).to.equal(0.5);
    });

    it('validatesLayerTypes', async () => {
      const rootItem = webMapLayer.layer!.item;
      expect(rootItem.item_type).to.equal('root');

      const items = webMapLayer.layer!.tree.getDescendants();

      const groupItem = items[7].item;
      if (groupItem.item_type === 'group') {
        expect(groupItem.children)
          .to.be.an('array')
          .and.to.have.length.greaterThan(0);
      }
      expect(groupItem.item_type).to.equal('group');

      const layerItem = items[0].item;
      if (layerItem.item_type === 'layer') {
        expect(layerItem.layer_style_id).to.equal(7131);
      }
      expect(layerItem.item_type).to.equal('layer');
    });
  });
});
