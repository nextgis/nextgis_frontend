import Vue, { CreateElement, VNode, VNodeData } from 'vue';
import Component from 'vue-class-component';
import { Prop, InjectReactive } from 'vue-property-decorator';
import { NgwMap } from '@nextgis/ngw-map';
import {
  MapControl,
  CreateControlOptions,
  ControlPositions,
  MapControls,
} from '@nextgis/webmap';
import { findNgwMapParent, propsBinder } from '../utils';

@Component
export class VueNgwControl extends Vue {
  @Prop({ type: String }) readonly position!: ControlPositions;
  @Prop({ type: Boolean }) readonly bar!: boolean;
  @Prop({ type: Boolean }) readonly margin!: boolean;
  @Prop({ type: String }) readonly addClass!: string;
  @Prop({ type: String }) readonly kind!: keyof MapControls;
  @Prop({ type: Object, default: () => ({}) })
  readonly controlOptions!: CreateControlOptions;

  @InjectReactive() readonly ngwMap!: NgwMap;

  name = 'vue-ngw-control';

  control?: unknown;
  ready = false;

  beforeDestroy(): void {
    if (this.ngwMap && this.control) {
      this.ngwMap.removeControl(this.control);
      this.control = undefined;
    }
  }

  setControl(element: HTMLElement): void {
    const ngwMap = this.ngwMap;
    const control = this.control;
    if (ngwMap) {
      if (control) {
        ngwMap.removeControl(control);
      }
      const adControlOptions: CreateControlOptions = {
        ...this.$props,
        ...this.$props.controlOptions,
      };
      const controlObject: MapControl = {
        onAdd: () => {
          return element;
        },
        onRemove: () => {
          // ignore
        },
      };
      let _control: keyof MapControls | any = this.kind;
      if (!_control) {
        _control = ngwMap.createControl(controlObject, adControlOptions);
      }
      this.control = ngwMap.addControl(_control, this.position);
    }
  }

  mounted(): void {
    this.setControl(this.$el as HTMLElement);
    this.ready = true;
    propsBinder(this, this.$props);

    this.$nextTick(() => {
      this.$emit('ready', this.control);
    });
  }

  render(h: CreateElement): VNode {
    const staticStyle: { [param: string]: string } = {
      // zIndex: '0'
    };

    const data: VNodeData = {
      staticClass: 'vue-ngw-control',
      staticStyle,
      // 'class': this.classes,
      attrs: { 'data-app': true },
      // domProps: { id: this.id }
    };
    return this.ready ? h('div', data, this.$slots.default) : h('div', data);
  }
}

export default VueNgwControl;
