import { Vue, Component, Prop } from 'vue-property-decorator';
import SendToCodepen from '../../SendToCodepen/SendToCodepen.vue';
import { Item, Package } from '../../../MainPage';

const changeHtmlMapAdapter: (
  html: string,
  adapter: Package,
  adapters: Package[],
) => string = require('../../../../scripts/changeHtmlMapAdapter');

@Component({
  components: { SendToCodepen },
})
export class HtmlExample extends Vue {
  @Prop() item: Item;
  @Prop() fullScreen?: boolean;

  _ngwMap: Package;

  get ngwMap(): string {
    const mapAdapters = this.item.ngwMaps;
    if (mapAdapters && mapAdapters.length) {
      if (!this._ngwMap) {
        return this._getDefaultNgwMap();
      } else {
        return this._ngwMap.name;
      }
    }
    return undefined;
  }

  set ngwMap(value: string) {
    const ngwMaps = this.item.ngwMaps;
    this.$store.dispatch('app/setDefaultNgwMap', value);
    if (ngwMaps && ngwMaps.length) {
      const exist = ngwMaps.find((x) => x.name === value);
      if (exist) {
        this._ngwMap = exist;
        this.item.html = changeHtmlMapAdapter(
          this.item.html,
          exist,
          this.item.ngwMaps,
        );
      }
    }
  }

  // beforeMount() {
  //   this.ngwMap = this.ngwMap;
  // }

  updated() {
    this.ngwMap = this._getDefaultNgwMap();
  }

  mounted() {
    this._writeIFrame(this.item.html);
    this.$watch('item.html', (newVal) => {
      this._writeIFrame(newVal);
    });
    // @ts-ignore
    this.$vuetify.goTo(0, { duration: 0 });
  }

  openFullPage() {
    if (this.item.id) {
      this.$router.push('/page/' + this.item.id);
    }
  }

  private _writeIFrame(html: string) {
    const wrapper = document.getElementById(
      'example-iframe',
    ) as HTMLFrameElement;
    wrapper.innerHTML = '';
    const iframe = document.createElement('iframe');
    wrapper.appendChild(iframe);
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();
  }

  private _getDefaultNgwMap(): string {
    const fromStorage = this.$store.state.app.defaultNgwMap;
    const exist =
      fromStorage &&
      this.item.ngwMaps &&
      this.item.ngwMaps.find((x) => x.name === fromStorage);
    if (exist) {
      return exist.name;
    }
    return this.item.ngwMaps[0] && this.item.ngwMaps[0].name;
  }
}
