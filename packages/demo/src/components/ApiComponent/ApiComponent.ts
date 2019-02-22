import { Vue, Component, Prop } from 'vue-property-decorator';
import ClassItem from './ClassItem/ClassItem.vue';
import { ApiItem } from './ApiItem';

@Component({
  components: { ClassItem }
})
export class ApiComponent extends Vue {

  @Prop() api: any;
  @Prop() package: string;

  get allowedChildren() {
    return this.getAllowedChildren(this.api);
  }

  mounted() {
    // @ts-ignore
    hljs.initHighlightingOnLoad();
    const hash = window.location.hash;
    if (hash) {
      // @ts-ignore
      this.$root.goTo(hash, {duration: 0});
    } else {
      // @ts-ignore
      this.$vuetify.goTo(0, {duration: 0});
    }
  }

  getAllowedItem(item: ApiItem) {
    return item.flags.isExported && !item.flags.isPrivate;
  }

  getAllowedChildren(item: ApiItem) {
    return item.children.filter((x) => this.getAllowedItem(x));
  }
}
