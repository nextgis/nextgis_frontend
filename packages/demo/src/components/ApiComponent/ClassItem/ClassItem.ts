import { Vue, Component, Prop } from 'vue-property-decorator';
import { ClassItem, ApiItem, Parameter, MethodItem, ParameterItem } from '../ApiItem';

import ConstructorItemComponent from '../ConstructorItem/ConstructorItem.vue';
import Comment from '../Comment/Comment.vue';
import Example from '../Example/Example.vue';
import * as utility from '../utility';
import { Indexes } from '../../../store/modules/api';

@Component({
  components: { ConstructorItemComponent, Comment, Example }
})
export class ClassItemComponent extends Vue {
  @Prop() item: ClassItem;
  indexes: Indexes;
  utility = utility;

  get allowedMembers() {
    return this.getAllowedMembers(this.item);
  }

  beforeCreate() {
    this.indexes = this.$store.state.api.indexes;
  }

  isItemAllow(item: ApiItem): boolean {
    const checkAllowedList: Array<() => boolean> = [
      // name not start from underscore `_`
      () => item.name.trim().slice()[0] !== '_',
      // item is not private
      () => item.flags.isPrivate !== undefined ? !item.flags.isPrivate : true,
      // item is Property or Method only
      () => ['Property', 'Method'].indexOf(item.kindString) !== -1
    ];
    return checkAllowedList.every((x) => x());
  }

  getAllowedMembers(item: ApiItem): Array<{ name: string; members: ApiItem[] }> {
    const children: ApiItem[] = item.children ? item.children.filter(this.isItemAllow) : [];
    const members = [];
    const staticMembers = [];
    children.forEach((x) => {
      if (x.flags.isStatic) {
        staticMembers.push(x);
      } else {
        members.push(x);
      }
    });
    return [
      { name: 'Members', members },
      { name: 'Static', members: staticMembers },
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
