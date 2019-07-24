import Vue from 'vue';
import Component from 'vue-class-component'

import { findNgwMapParent } from '../utils';
import { ResourceAdapter } from '@nextgis/ngw-kit';
import { VueNgwMap } from '../VueNgwMap';

@Component({
  props: {
    resourceId: Number,
    fit: Boolean,
    adapterOptions: {
      type: Object,
      default: () => ({})
    }
  },
})
export class VueNgwResource extends Vue {
  name = 'vue-ngw-resource';
  parentContainer!: VueNgwMap;

  layer?: ResourceAdapter;

  beforeDestroy() {
    if (this.parentContainer.ngwMap && this.layer) {
      this.parentContainer.ngwMap.removeLayer(this.layer);
      this.layer = undefined;
    }
  }

  async mounted() {
    this.parentContainer = findNgwMapParent(this.$parent);
    const ngwMap = this.parentContainer.ngwMap;

    this.layer = await ngwMap.addNgwLayer({
      resourceId: this.$props.resourceId,
      adapter: this.$props.adapter,
      fit: this.$props.fit,
      adapterOptions: this.$props.adapterOptions
    });

    this.$nextTick(() => {
      this.$emit('ready', this.layer);
    });

  }

  render() {
    return null;
  }

}

export default VueNgwResource;
