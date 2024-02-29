import { NgwMap } from '@nextgis/ngw-map';
import Vue from 'vue';

import type { VueNgwMapData, VueNgwMapProps } from '../interfaces';
import type { CreateElement, VNode, VNodeData } from 'vue';

export const VueNgwMap = Vue.extend<VueNgwMapData, any, any, VueNgwMapProps>({
  props: {
    mapAdapter: Object,
    fullFilling: Boolean,
    connector: Object,
    baseUrl: String,
    qmsId: String,
    webMapId: String,
    mapOptions: Object,
  },

  data: () => {
    return {
      ngwMap: {} as NgwMap,
      ready: false,
    };
  },

  mounted(): void {
    this.ngwMap = new NgwMap({
      ...this.$props,
      ...this.$props.mapOptions,
      mapAdapter: this.$props.mapAdapter,
      target: this.$el as HTMLElement,
    });
    this.ngwMap.onLoad().then(() => {
      this.$nextTick().then(() => {
        this.ready = true;
        this.$emit('load', this.ngwMap);
      });
    });
  },
  beforeDestroy(): void {
    if (this.ngwMap) {
      this.ngwMap.destroy();
    }
  },
  render(h: CreateElement): VNode {
    const staticStyle: { [param: string]: string } = {
      zIndex: '0',
    };
    if (this.$props.fullFilling) {
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
  },
});
