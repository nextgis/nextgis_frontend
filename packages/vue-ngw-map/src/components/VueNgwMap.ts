import { VNode, VNodeData, CreateElement } from 'vue';
import { Prop, Vue } from 'vue-property-decorator';
import Component from 'vue-class-component';
import { MapAdapter } from '@nextgis/webmap';
import { NgwMap, NgwMapOptions } from '@nextgis/ngw-map';

import NgwConnector from '@nextgis/ngw-connector';

@Component
export class VueNgwMap<M = any> extends Vue {
  @Prop({ type: Object }) mapAdapter!: MapAdapter;
  @Prop({ type: Boolean }) fullFilling!: boolean;
  @Prop({ type: NgwConnector }) connector!: NgwConnector;
  @Prop({ type: String }) baseUrl!: string;
  @Prop({ type: Number }) qmsId!: string;
  @Prop({ type: String }) webMapId!: string;
  @Prop({ type: Object }) mapOptions!: NgwMapOptions;

  name = 'vue-ngw-map';
  ngwMap: NgwMap<M> | null = null;
  ready = false;

  async mounted(): Promise<void> {
    this.ngwMap = new NgwMap(this.mapAdapter, {
      ...this.$props,
      ...this.mapOptions,
      target: this.$el as HTMLElement,
    });
    await this.ngwMap.onLoad();

    await this.$nextTick();
    this.ready = true;
    this.$emit('load', this.ngwMap);
  }

  beforeDestroy(): void {
    if (this.ngwMap) {
      this.ngwMap.destroy();
    }
  }

  render(h: CreateElement): VNode {
    const staticStyle: { [param: string]: string } = {
      zIndex: '0',
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

export default VueNgwMap;
