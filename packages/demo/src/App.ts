import { Vue, Component, } from 'vue-property-decorator';
import { AppPages } from './store/modules/app';
import HtmlExample from './components/Examples/HtmlExample/HtmlExample.vue';

interface Item {
  id?: string;
  name: string;
  description?: string;
  html?: string;
  children?: Item[];
  model?: boolean;
  component?: any;
}

@Component
export class App extends Vue {

  active = [];
  tree = [];

  open: string[] = [];

  drawer = null;

  items = null;

  get page(): AppPages {
    return this.$store.state.app.page;
  }

  set page(value: AppPages) {
    this.$store.dispatch('app/setPage', value);
  }

  get current() {

    if (!this.active.length) { return undefined; }
    const id = this.active[0];
    const item = this.findItem(id);
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
    const prepareItem = (conf) => {
      const item: Item = {
        id: conf.id,
        name: conf.name,
      };
      if (conf.children) {
        item.model = true;
        item.children = conf.children.map(prepareItem);
      } else {
        item.component = HtmlExample;
        item.html = conf.html;
      }
      return item;
    };
    const config = process.env.EXAMPLES;
    // @ts-ignore
    this.items = config.map((x) => {
      return prepareItem(x);
    });
    this.open = [this.items[0].id];
    // this.current = this.items[0].children[0];
    this.active = [this.items[0].children[0].id];
  }

}
