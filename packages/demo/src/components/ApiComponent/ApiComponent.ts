import { Vue, Component, Prop } from 'vue-property-decorator';
import ClassItem from './ClassItem/ClassItem.vue';
import { ApiItem } from './ApiItem';
import { Item } from '../../MainPage';

@Component({
  components: { ClassItem }
})
export class ApiComponent extends Vue {

  @Prop() item: Item;

  get allowedChildren() {
    return this.getAllowedChildren(this.item.api);
  }

  mounted() {
    this._refresh();
  }

  updated() {
    this._refresh();
  }

  getAllowedItem(item: ApiItem) {
    return item.flags.isExported && !item.flags.isPrivate;
  }

  getAllowedChildren(item: ApiItem) {
    return item.children.filter((x) => this.getAllowedItem(x));
  }

  private _refresh() {
    // @ts-ignore
    hljs.initHighlightingOnLoad();
    this._goTo();
  }

  private _goTo() {
    const hash = window.location.hash;
    if (hash) {
      // @ts-ignore
      this.$root.goTo(hash, { duration: 0 });
    } else {
      // @ts-ignore
      this.$vuetify.goTo(0, { duration: 0 });
    }
  }
}
