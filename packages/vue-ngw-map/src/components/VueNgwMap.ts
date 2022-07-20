import { VNode, VNodeData, CreateElement } from 'vue';
import { Prop, Vue, Watch } from 'vue-property-decorator';
import { NgwMap } from '@nextgis/ngw-map';
import Component from 'vue-class-component';
import NgwConnector from '@nextgis/ngw-connector';

import type { LngLatBoundsArray } from '@nextgis/utils';
import type { NgwMapOptions } from '@nextgis/ngw-map';
import type { MapAdapter, Cursor } from '@nextgis/webmap';

@Component
export class VueNgwMap<M = any> extends Vue {
  @Prop({ type: Function }) readonly mapAdapter!: () => MapAdapter;
  @Prop({ type: [Function, Object] }) readonly connector!:
    | (() => NgwConnector)
    | NgwConnector;
  @Prop({ type: Boolean }) readonly fullFilling!: boolean;
  @Prop({ type: String }) readonly baseUrl!: string;
  @Prop({ type: Number }) readonly qmsId!: string;
  @Prop({ type: String }) readonly webMapId!: string;
  @Prop({ type: Object }) readonly mapOptions!: NgwMapOptions;
  @Prop({ type: Object }) readonly mapAdapterOptions!: Record<string, unknown>;
  @Prop({ type: Array }) readonly bounds!: LngLatBoundsArray;
  @Prop({ type: Boolean }) readonly osm!: boolean;
  @Prop({ type: Number }) readonly setViewDelay!: number;
  @Prop({ type: String }) readonly cursor!: Cursor;

  // @ProvideReactive() ngwMap!: NgwMap<M>;
  _ngwMap!: NgwMap<M>;

  name = 'vue-ngw-map';
  ready = false;

  get ngwMap(): NgwMap<M> {
    return this._ngwMap;
  }

  @Watch('bounds')
  onBoundsChange(bounds: LngLatBoundsArray): void {
    if (this._ngwMap) {
      this._ngwMap.fitBounds(bounds);
    }
  }

  @Watch('cursor')
  onCursorChange(cursor: Cursor): void {
    this._ngwMap.setCursor(cursor || 'default');
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
    if (typeof this.mapAdapter === 'function') {
      props.mapAdapter = this.mapAdapter();
    }
    if (typeof this.connector === 'function') {
      props.connector = this.connector();
    }

    this._ngwMap = new NgwMap({
      ...props,
      ...this.getMapOptions(),
      target: this.$el as HTMLElement,
    });
    this._ngwMap.onLoad().then(() => {
      this.$nextTick().then(() => {
        this._onReady();
        this.ready = true;
        this.$emit('load', this.ngwMap);
      });
      this._addEventsListener();
    });
  }

  beforeDestroy(): void {
    if (this._ngwMap) {
      this._ngwMap.destroy();
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
    this._ngwMap.emitter.on('click', (e) => {
      this.$emit('click', e);
    });
  }
}

export default VueNgwMap;
