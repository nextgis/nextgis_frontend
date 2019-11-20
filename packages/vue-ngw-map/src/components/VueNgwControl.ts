import Vue, { CreateElement, VNode, VNodeData } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { findNgwMapParent, propsBinder } from '../utils';
import { NgwLayerAdapterType } from '@nextgis/ngw-kit';
import { VueNgwMap } from './VueNgwMap';
import { MapControl, CreateControlOptions } from '@nextgis/webmap';

@Component
export class VueNgwControl extends Vue {
  name = 'vue-ngw-control';

  @Prop({ type: String }) position!: NgwLayerAdapterType;
  @Prop({ type: Object, default: () => ({}) }) controlOptions!: CreateControlOptions;

  parentContainer!: VueNgwMap;

  control?: MapControl;

  beforeDestroy() {
    if (this.parentContainer.ngwMap && this.control) {
      this.parentContainer.ngwMap.removeControl(this.control);
      this.control = undefined;
    }
  }

  async setControl(element: HTMLElement) {
    const ngwMap = this.parentContainer.ngwMap;
    const control = this.control;
    if (ngwMap) {
      if (control) {
        ngwMap.removeControl(control);
      }
      const adcontrolOptions: CreateControlOptions = { ...this.$props.controlOptions };
      const controlObject: MapControl = {
        onAdd: () => {
          return element;
        },
        onRemove: () => {
          // ignore
        }
      };
      this.control = await ngwMap.createControl(controlObject, adcontrolOptions);
    }
  }

  async mounted() {
    this.parentContainer = findNgwMapParent(this.$parent);

    await this.setControl(this.$el as HTMLElement);

    propsBinder(this, this.$props);

    this.$nextTick(() => {
      this.$emit('ready', this.control);
    });
  }

  render(h: CreateElement): VNode {
    const staticStyle: { [param: string]: string } = {
      zIndex: '0'
    };

    const data: VNodeData = {
      staticClass: 'vue-ngw-control',
      staticStyle,
      // 'class': this.classes,
      attrs: { 'data-app': true }
      // domProps: { id: this.id }
    };

    return h('div', data, this.$slots.default);
  }
}

export default VueNgwControl;
