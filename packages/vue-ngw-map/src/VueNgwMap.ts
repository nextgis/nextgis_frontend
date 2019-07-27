import Vue, { VNode, VNodeData, CreateElement } from 'vue';
import Component from 'vue-class-component'
import NgwMap from '@nextgis/ngw-map';
import MapAdapter from '@nextgis/leaflet-map-adapter';

import 'leaflet/dist/leaflet.css';

@Component({
  props: {
    fullFilling: Boolean,
    connector: {
      type: Object,
      default: () => ({})
    },
    baseUrl: {
      type: String,
      default: ''
    },
    qmsId: {
      type: String,
      default: ''
    },
    webmapId: {
      type: String,
      default: ''
    }
  }
})
export class VueNgwMap extends Vue {
  name = 'vue-ngw-map';

  fullFilling!: boolean;
  ngwMap!: NgwMap;
  ready = false;

  async mounted() {
    await this._setNgwMap();
  }

  beforeDestroy() {
    this.ngwMap.destroy();
  }

  render(h: CreateElement): VNode {
    const staticStyle: { [param: string]: string } = {
      zIndex: '0'
    };
    if (this.fullFilling) {
      staticStyle.width = '100%';
      staticStyle.height = '100%';
    }

    const data: VNodeData = {
      staticClass: 'vue-ngw-map',
      staticStyle,
      // 'class': this.classes,
      attrs: { 'data-app': true },
      // domProps: { id: this.id }
    };

    return this.ready ? h('div', data, this.$slots.default) : h('div', data);
  }

  private async _setNgwMap() {
    this.ngwMap = await new NgwMap(new MapAdapter(), {
      target: this.$el as HTMLElement,
      ...this.$props
    });
    this.ready = true;
  }
}
