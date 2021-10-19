import { mdiGithub } from '@mdi/js';
import { Vue, Component, Watch } from 'vue-property-decorator';
import HtmlExample from './components/Examples/HtmlExample/HtmlExample.vue';
import Readme from './components/Readme/Readme.vue';
import Logo from './components/Logo/Logo.vue';

export interface Package {
  name: string;
  version: string;
  main: string;
}

export interface Item {
  id: string;
  name: string;
  tags: string[];
  page?: 'example' | 'readme' | 'api';
  description?: string;
  html?: string;
  md?: string;
  children?: Item[];
  model?: boolean;
  component?: any;
  icon?: string;
  priority?: number;
  ngwMaps?: Package[];
  _parent?: Item;
}

@Component({
  components: { Logo },
})
export class MainPage extends Vue {
  active = [];

  open: string[] = [];

  drawer = null;

  search: string | null = null;

  items: Item[] = null;
  currentItemId: string;

  icons = {
    github: mdiGithub,
  };

  get current(): Item {
    if (!this.active.length) {
      return undefined;
    }
    const id = this.active[0];
    const item = this.findItem(id);
    this._setPath(item.id);

    return item;
  }

  @Watch('$route')
  onPathChange(): void {
    this._setActive();
  }

  mounted(): void {
    this._build();
  }

  onOpen(data: string[]): void {
    this.open = data;
  }

  findItem(id: string, _items = this.items): Item {
    for (let fry = 0; fry < _items.length; fry++) {
      const x = _items[fry];
      if (x.id === id) {
        if (x.children) {
          const readme = x.children.find((y) => y.page === 'readme');
          if (readme) {
            return readme;
          }
        }
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

  filter(item: Item, search: string): boolean {
    const getHtml = () => {
      const match =
        item.html && item.html.match(/<script[\s\S]*?>[\s\S]*?<\/script>/gi);
      return match && match.join(' ');
    };
    return [
      item.name,
      item.description,
      item.tags && item.tags.join(' '),
      getHtml,
    ].some((x) => {
      const text =
        x && (typeof x === 'string' ? x : search.length > 2 ? x() : '');
      return text && text.indexOf(search) !== -1;
    });
  }

  private _setActive(): void {
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
      const getFirstPageItem = (items: Item[]) => {
        return items.find((i) => {
          const pageContent = i.html || i.md;
          if (pageContent) {
            return pageContent;
          } else if (i.children) {
            return getFirstPageItem(i.children);
          }
        });
      };
      const item = getFirstPageItem(this.items);
      const slug = item ? item.id : '';
      this._setPath(slug);
    }
  }

  private _setPath(id?: string): void {
    const paramsId = this.$router.currentRoute.params.id;
    if (paramsId !== id) {
      let path = this.$router.currentRoute.fullPath;
      path = path.replace(this.$router.currentRoute.hash, '');
      if (
        this.$router.currentRoute.params &&
        this.$router.currentRoute.params.id
      ) {
        path = path.replace(this.$router.currentRoute.params.id, '');
      }
      this.$router.push(path + id);
    }
    this.currentItemId = id;
  }

  private async _build() {
    // this.api = this.$store.state.api.api;

    const prepareItem = (conf: Item, _parent?) => {
      const item: Item = { ...conf };
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
      return item;
    };
    let config = process.env.EXAMPLES;

    this.items = config = (config as any).map((x) => {
      return prepareItem(x);
    });

    this._setActive();
  }
}
