import { VNode, VNodeData, CreateElement } from 'vue';
import { Prop, Vue, Watch } from 'vue-property-decorator';
import Component from 'vue-class-component';
import { MapAdapter, Cursor } from '@nextgis/webmap';
import { LngLatBoundsArray } from '@nextgis/utils';
import { NgwMap, NgwMapOptions } from '@nextgis/ngw-map';

import NgwConnector from '@nextgis/ngw-connector';

@Component
export class VueNgwMap<M = any> extends Vue {
  @Prop({ type: Object }) readonly mapAdapter!: MapAdapter;
  @Prop({ type: Boolean }) readonly fullFilling!: boolean;
  @Prop({ type: NgwConnector }) readonly connector!: NgwConnector;
  @Prop({ type: String }) readonly baseUrl!: string;
  @Prop({ type: Number }) readonly qmsId!: string;
  @Prop({ type: String }) readonly webMapId!: string;
  @Prop({ type: Object }) readonly mapOptions!: NgwMapOptions;
  @Prop({ type: Array }) readonly bounds!: LngLatBoundsArray;
  @Prop({ type: Boolean }) readonly osm!: boolean;
  @Prop({ type: String }) readonly cursor!: Cursor;

  // @ProvideReactive() ngwMap!: NgwMap<M>;
  ngwMap!: NgwMap<M>;

  name = 'vue-ngw-map';
  ready = false;

  @Watch('bounds')
  onBoundsChange(bounds: LngLatBoundsArray): void {
    if (this.ngwMap) {
      this.ngwMap.fitBounds(bounds);
    }
  }

  @Watch('cursor')
  onCursorChange(cursor: Cursor): void {
    this.ngwMap.setCursor(cursor || 'default');
  }

  getMapOptions(): NgwMapOptions {
    return this.mapOptions;
  }

  mounted(): void {
    const props: Record<string, any> = {};
    for (const p in this.$props) {
      const prop = this.$props[p];
      if (prop !== undefined) {
        props[p] = prop;
      }
    }
    this.ngwMap = new NgwMap({
      mapAdapter: this.mapAdapter,
      ...this.getMapOptions(),
      ...props,
      target: this.$el as HTMLElement,
    });
    this.ngwMap.onLoad().then(() => {
      this.$nextTick().then(() => {
        this._onReady();
        this.ready = true;
        this.$emit('load', this.ngwMap);
      });
      this._addEventsListener();
    });
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

  private _onReady() {
    if (this.cursor) {
      this.onCursorChange(this.cursor);
    }
  }

  private _addEventsListener() {
    this.ngwMap.emitter.on('click', (e) => {
      this.$emit('click', e);
    });
  }
}

export default VueNgwMap;
