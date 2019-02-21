import { Vue, Component, Watch } from 'vue-property-decorator';
import HtmlExample from './components/Examples/HtmlExample/HtmlExample.vue';
import Readme from './components/Readme/Readme.vue';
import ApiComponent from './components/ApiComponent/ApiComponent.vue';
import Logo from './components/Logo/Logo.vue';
import { ApiItem } from './components/ApiComponent/ApiItem';

export interface Item {
  id: string;
  name: string;
  page?: 'example' | 'readme' | 'api';
  description?: string;
  html?: string;
  children?: Item[];
  model?: boolean;
  component?: any;
  icon?: string;
  api?: ApiItem;
  _parent?: Item;
}

@Component({
  components: { Logo }
})
export class MainPage extends Vue {

  active = [];

  open: string[] = [];

  drawer = null;

  api?: ApiItem;

  items: Item[] = null;
  currentItemId: string;

  @Watch('$route')
  onPathChange() {
    this._setActive();
  }

  get current() {
    if (!this.active.length) { return undefined; }
    const id = this.active[0];
    const item = this.findItem(id);
    this._setPath(item.id);
    return item;
  }

  mounted() {
    this.api = this.$store.state.api.api;
    const prepareItem = (conf, _parent?) => {
      const item: Item = {
        id: conf.id,
        name: conf.name,
        description: conf.description,
        page: conf.page
      };
      if (conf.children) {
        item.model = true;
        item.children = conf.children.map((i) => prepareItem(i, item));
        const apiModule = this.$store.getters['api/getApiModule'](item.name);
        if (apiModule) {
          item.children.push({
            name: 'API',
            id: item.id + '-api',
            page: 'api',
            component: ApiComponent,
            icon: 'mdi-information-outline',
            api: apiModule,
          });
        }
      } else {
        item._parent = _parent;
      }
      if (item.page === 'example') {
        item.component = HtmlExample;
        item.icon = 'mdi-code-tags';
      } else if (item.page === 'readme') {
        item.component = Readme;
        item.icon = 'mdi-information-outline';
      } else if (item.page === 'api') {
        item.component = ApiComponent;
        item.icon = 'mdi-information-outline';
      }
      item.html = conf.html;
      return item;
    };
    const config = process.env.EXAMPLES;
    // @ts-ignore
    this.items = config = config.map((x) => {
      return prepareItem(x);
    });

    this._setActive();
  }

  onOpen(data: string[]) {
    this.open = data;
  }

  findItem(id: string, _items = this.items) {
    for (let fry = 0; fry < _items.length; fry++) {
      const x = _items[fry];
      if (x.id === id) {
        return x;
      }
      if (x.children) {
        const find = this.findItem(id, x.children);
        if (find) {
          return find;
        }
      }
    }
  }

  _setActive() {
    const id = this.$route.params && this.$route.params.id;
    const treeItem = id && this.findItem(id);
    if (treeItem) {
      const parents = [];
      let parent = treeItem._parent;
      while (parent) {
        parents.push(parent.id);
        parent = parent._parent;
      }
      this.open = this.open.concat(parents);
      this.active = [treeItem.id];
    } else {
      const getFirstHtmlItem = (items: Item[]) => {
        return items.find((i) => {
          if (i.html) {
            return i.html;
          } else if (i.children) {
            return getFirstHtmlItem(i.children);
          }
        });
      };
      const item = getFirstHtmlItem(this.items);
      const slug = item ? item.id : '';
      this._setPath(slug);
    }
  }

  _setPath(id?: string) {
    const paramsId = this.$router.currentRoute.params.id;
    if (paramsId !== id) {
      let path = this.$router.currentRoute.fullPath;
      path = path.replace(this.$router.currentRoute.hash, '');
      if (this.$router.currentRoute.params && this.$router.currentRoute.params.id) {
        path = path.replace(this.$router.currentRoute.params.id, '');
      }
      this.$router.push(path + id);
    }
    this.currentItemId = id;
  }
}
