import Vue, { VNode, VNodeData, CreateElement } from 'vue';
import { Prop } from 'vue-property-decorator';
import Component from 'vue-class-component';
import NgwMap from '@nextgis/ngw-map';
import MapAdapter from '@nextgis/leaflet-map-adapter';

import 'leaflet/dist/leaflet.css';
import NgwConnector from '@nextgis/ngw-connector';

@Component
export class VueNgwMap extends Vue {
  @Prop({ type: Boolean }) fullFilling!: boolean;
  @Prop({ type: NgwConnector }) connector!: NgwConnector;
  @Prop({ type: String }) baseUrl!: string;
  @Prop({ type: Number }) qmsId!: string;
  @Prop({ type: String }) webMapId!: string;
  name = 'vue-ngw-map';
  ngwMap!: NgwMap;
  ready = false;

  mounted() {
    this._setNgwMap();
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
      attrs: { 'data-app': true }
      // domProps: { id: this.id }
    };

    return this.ready ? h('div', data, this.$slots.default) : h('div', data);
  }

  private _setNgwMap() {
    this.ngwMap = new NgwMap(new MapAdapter(), {
      target: this.$el as HTMLElement,
      ...this.$props
    });
    this.ready = true;
  }
}
