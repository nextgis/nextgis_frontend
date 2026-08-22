import { expect } from 'chai';

import { NgwWebmapItem } from '../../packages/ngw-kit/src/NgwWebmapItem';

import type {
  TreeGroup,
  TreeLayer,
} from '../../packages/ngw-kit/src/interfaces';
import type { NgwWebmapItemOptions } from '../../packages/ngw-kit/src/NgwWebmapItem';

describe('NGW webmap groups', () => {
  it('uses group_enabled as the visibility state', () => {
    const group: TreeGroup = {
      item_type: 'group',
      display_name: 'Group',
      group_expanded: false,
      group_enabled: true,
      group_exclusive: false,
      children: [],
    };
    const item = new NgwWebmapItem({
      webMap: {} as NgwWebmapItemOptions['webMap'],
      item: group,
      noInit: true,
    });

    expect(item.properties.get('visibility')).to.be.true;

    item.properties.set('visibility', false);

    expect(group.group_enabled).to.be.false;
  });

  it('blocks enabled layers inside a disabled group', async () => {
    const layer = {
      item_type: 'layer',
      display_name: 'Layer',
      layer_adapter: 'image',
      layer_enabled: true,
    } as TreeLayer;
    const group: TreeGroup = {
      item_type: 'group',
      display_name: 'Group',
      group_expanded: false,
      group_enabled: false,
      group_exclusive: false,
      children: [layer],
    };
    const item = new NgwWebmapItem({
      webMap: {
        addLayer: () => new Promise(() => undefined),
      } as NgwWebmapItemOptions['webMap'],
      item: group,
    });

    await new Promise<void>((resolve) => item.emitter.once('init', resolve));

    const childVisibility = item.tree
      .getChildren()[0]
      .properties.property('visibility');

    expect(childVisibility.get()).to.be.true;
    expect(childVisibility.isBlocked()).to.be.true;
  });
});
