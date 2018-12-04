import { Vue, Component, Watch } from 'vue-property-decorator';
import HtmlExample from './components/Examples/HtmlExample/HtmlExample.vue';
import Readme from './components/Readme/Readme.vue';
import Logo from './components/Logo/Logo.vue';

interface Item {
  id: string;
  name: string;
  page?: 'example' | 'readme';
  description?: string;
  html?: string;
  children?: Item[];
  model?: boolean;
  component?: any;
  icon?: string;
  _parent?: Item;
}

@Component({
  components: {Logo}
})
export class App extends Vue {

  active = [];

  open: string[] = [];

  drawer = null;

  items = null;

  @Watch('$route')
  onPathChange(to, from) {
    this._setActive();
  }

  get current() {
    if (!this.active.length) { return undefined; }
    const id = this.active[0];
    const item = this.findItem(id);
    this.$router.push('/' + item.id);
    return item;
  }

  findItem(id, _items = this.items) {
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

  mounted() {
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
      } else {
        item._parent = _parent;
      }
      if (item.page === 'example') {
        item.component = HtmlExample;
        item.icon = 'mdi-code-tags';
      } else if (item.page === 'readme') {
        item.component = Readme;
        item.icon = 'mdi-information-outline';
      }
      item.html = conf.html;
      return item;
    };
    const config = process.env.EXAMPLES;
    // @ts-ignore
    this.items = config.map((x) => {
      return prepareItem(x);
    });
    this._setActive();
  }

  onOpen(data) {
    this.open = data;
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
      this.$router.push('/' + slug);
    }
  }
}
