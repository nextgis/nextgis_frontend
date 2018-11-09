import { Vue, Component, Watch } from 'vue-property-decorator';
import { AppPages } from './store/modules/app';
import HtmlExample from './components/Examples/HtmlExample/HtmlExample.vue';
import { watch } from 'fs';

interface Item {
  id?: string;
  name: string;
  description?: string;
  html?: string;
  children?: Item[];
  model?: boolean;
  component?: any;
  _parent?: Item;
}

@Component
export class App extends Vue {

  active = [];
  tree = [];

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
        description: conf.description
      };
      if (conf.children) {
        item.model = true;
        item.children = conf.children.map((i) => prepareItem(i, item));
      } else {
        item.component = HtmlExample;
        item.html = conf.html;
        item._parent = _parent;
      }
      return item;
    };
    const config = process.env.EXAMPLES;
    // @ts-ignore
    this.items = config.map((x) => {
      return prepareItem(x);
    });
    this._setActive();
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
      this.$router.push('/' + this.items[0].children[0].id);
    }
  }
}
