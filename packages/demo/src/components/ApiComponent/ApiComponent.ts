import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import ClassItem from './ClassItem/ClassItem.vue';
import { ApiItem } from './ApiItem';
import { Item } from '../../MainPage';

@Component({
  components: { ClassItem }
})
export class ApiComponent extends Vue {

  @Prop() item: Item;

  // These two parameters are used to increase the speed of page rendering.
  showedMembers: string[] = [];
  showMembersOnInit = 5;

  get allowedChildren() {
    return this.getAllowedChildren(this.item.api);
  }

  @Watch('$route')
  onPathChange() {
    // @ts-ignore
    this.$vuetify.goTo(0, { duration: 0 });
    this._refresh();
  }

  mounted() {
    this._refresh();

  }

  showItemMembers(itemName: string) {
    const exist = this.showedMembers.indexOf(itemName) !== -1;
    if (!exist) {
      // clean url hash to disable goTo on update
      // history.pushState('', document.title, window.location.pathname);
      this.showedMembers.push(itemName);
    }
  }

  updated() {
    // this._refresh();
  }

  getAllowedItem(item: ApiItem) {
    return item.flags.isExported && !item.flags.isPrivate;
  }

  getAllowedChildren(item: ApiItem) {
    return item.children.filter((x) => this.getAllowedItem(x));
  }

  isMembersShowed(itemName: string): boolean {
    return this.showedMembers.indexOf(itemName) !== -1;
  }

  private _refresh() {
    this._goTo();

    // open first allowed members count
    const children = this.allowedChildren;
    const length = children.length < this.showMembersOnInit ?
      children.length : this.showMembersOnInit;
    for (let fry = 0; fry < length; fry++) {
      this.showItemMembers(children[fry].name);
    }
  }

  private _goTo() {
    const hash = window.location.hash;
    if (hash) {
      this.showItemMembers(hash.replace('#', ''));
      // @ts-ignore
      this.$root.goTo(hash, { duration: 0 });
    }
  }
}
