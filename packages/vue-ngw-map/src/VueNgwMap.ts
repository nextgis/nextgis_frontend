import Vue, { VNode, VNodeData, CreateElement } from 'vue';
import Component from 'vue-class-component'
import NgwMap, { NgwMapOptions } from '@nextgis/ngw-map';
import MapAdapter from '@nextgis/leaflet-map-adapter';

import 'leaflet/dist/leaflet.css';

@Component({
  props: {
    fullFilling: Boolean,
    baseUrl: {
      type: String,
      default: ''
    },
    qmsId: String,
    webmapId: String
  }
})
export class VueNgwMap extends Vue {
  name = 'vue-ngw-map';

  fullFilling!: boolean;
  ngwMap!: NgwMap;
  ready = false;

  async mounted() {
    this.ngwMap = await new NgwMap(new MapAdapter(), {
      target: this.$el as HTMLElement,
      ...this.$props
    });
    this.ready = true;
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
}
