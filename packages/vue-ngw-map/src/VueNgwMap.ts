// Styles

// Types
import Vue, { VNode, VNodeData } from 'vue';
import NgwMap, { NgwMapOptions } from '@nextgis/ngw-map';
import MapAdapter from '@nextgis/leaflet-map-adapter';

import 'leaflet/dist/leaflet.css';

interface Data {
  ngwMap?: NgwMap;
}

interface Props extends NgwMapOptions {
  fullFilling?: boolean;
}

const vueNgwMap = Vue.extend<Data, any, any, Props>({
  name: 'vue-ngw-map',

  props: {
    fullFilling: Boolean,
    baseUrl: {
      type: String,
      default: ''
    },
    qmsId: undefined,
    webmapId: undefined
  },

  // data: {
  //   ngwMap: undefined
  // },

  computed: {
    //
  },

  watch: {
    // '$route': 'onRouteChange'
  },

  mounted() {
    this.ngwMap = new NgwMap(new MapAdapter(), {
      target: this.$el,
      ...this.$props
    });
  },

  methods: {
    //
  },

  render(h): VNode {
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

    return h('div', data, this.$slots.default);
  }
});

export default vueNgwMap;
