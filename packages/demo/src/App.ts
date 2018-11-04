import { Vue, Component, } from 'vue-property-decorator';
import { AppPages } from './store/modules/app';
import HtmlExample from './components/Examples/HtmlExample/HtmlExample.vue';

interface Item {
  id?: string;
  name: string;
  description?: string;
  html?: string;
  icon?: string;
  iconAlt?: string;
  children?: Item[];
  model?: boolean;
  component?: any;
}

@Component
export class App extends Vue {

  drawer = null;

  current = null;

  items = null;

  get page(): AppPages {
    return this.$store.state.app.page;
  }

  set page(value: AppPages) {
    this.$store.dispatch('app/setPage', value);
  }

  mounted() {
    const prepareItem = (conf) => {

      const icon = 'keyboard_arrow_up';
      const iconAlt = 'keyboard_arrow_down';
      const item: Item = {
        id: conf.id,
        name: conf.name,
      };
      if (conf.children) {
        item.model = true;
        item.icon = icon;
        item.iconAlt = iconAlt;
        item.children = conf.children.map(prepareItem);
        console.log(item.children);
      } else {
        item.component = HtmlExample;
        item.html = conf.html;
      }
      return item;
    };
    const config = process.env.EXAMPLES;
    // console.log(JSON.parse(config));
    // @ts-ignore
    this.items = config.map((x) => {
      return prepareItem(x);
    });
    this.current = this.items[0].children[0];
  }

}
