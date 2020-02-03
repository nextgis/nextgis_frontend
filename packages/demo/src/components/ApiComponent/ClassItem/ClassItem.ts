import { Vue, Component, Prop } from 'vue-property-decorator';
import { ClassItem, ApiItem, Parameter, MethodItem } from '../ApiItem';

import ConstructorItemComponent from '../ConstructorItem/ConstructorItem.vue';
import Comment from '../Comment/Comment.vue';
import Example from '../Example/Example.vue';
import Property from '../Property/Property.vue';
import Class from './ClassItem.vue';
import * as utility from '../utility';
import { Indexes } from '../../../store/modules/api';

@Component({
  name: 'Class',
  components: { ConstructorItemComponent, Comment, Example, Class, Property }
})
export class ClassItemComponent extends Vue {
  @Prop() item: ClassItem | MethodItem;
  @Prop() showMembers: boolean;
  indexes: Indexes;
  utility = utility;

  get allowedMembers() {
    return this.getAllowedMembers(this.item);
  }

  get toReturn() {
    if (this.item.kindString === 'Method') {
      return this.utility.createMethodReturn(this.item, this.indexes);
    }
    return '';
  }

  beforeCreate() {
    this.indexes = this.$store.state.api.indexes;
  }

  mounted() {
    // @ts-ignore
    this.$root.updateLinks(this.$el);
  }

  // updated() {
  //   // @ts-ignore
  //   this.$root.updateLinks(this.$el);
  // }

  isItemAllow(item: ApiItem): boolean {
    const checkAllowedList: Array<() => boolean> = [
      // name not start from underscore `_`
      () => item.name.trim().slice()[0] !== '_',
      // item is not private
      () => (item.flags.isPrivate !== undefined ? !item.flags.isPrivate : true),
      // item is Property or Method only
      () => ['Property', 'Method', 'Event'].indexOf(item.kindString) !== -1
    ];
    return checkAllowedList.every(x => x());
  }

  getAllowedMembers(
    item: ApiItem
  ): Array<{ name: string; members: ApiItem[] }> {
    const children: ApiItem[] = item.children
      ? item.children.filter(this.isItemAllow)
      : [];
    const members = [];
    const staticMembers = [];
    const events = [];
    children.forEach(x => {
      if (x.flags.isStatic) {
        staticMembers.push(x);
      } else if (x.kindString === 'Event') {
        events.push(x);
      } else {
        members.push(x);
      }
    });
    return [
      { name: 'Members', members },
      { name: 'Events', members: events },
      { name: 'Static', members: staticMembers }
    ];
  }

  getGithubSourceLinks(item: ApiItem) {
    return utility.getSourceLink(item);
  }

  createTypedName(item: Parameter) {
    const type = this.utility.getOptionType(item.type, this.indexes);
    const name = this.utility.getParameterName(item);
    return `${name}${type ? ': ' + type : ''}`;
  }

  createMethodString(methodItem: MethodItem) {
    return this.utility.createMethodString(methodItem, this.indexes);
  }
}
