import { Vue, Component, Prop } from 'vue-property-decorator';
import { ClassItem, ApiItem, Parameter, MethodItem } from '../ApiItem';

import ConstructorItemComponent from './ConstructorItem.vue';
import Comment from './Comment.vue';
import * as utility from '../utility';
import { Indexes } from 'packages/demo/src/store/modules/api';

@Component({
  components: { ConstructorItemComponent, Comment }
})
export class ClassItemComponent extends Vue {
  @Prop() item: ClassItem;
  indexes: Indexes;
  utility = utility;

  beforeCreate() {
    this.indexes = this.$store.state.api.indexes;
  }

  isItemAllow(item: ApiItem): boolean {
    const allowedByFlags = item.flags.isPrivate !== undefined ? !item.flags.isPrivate : true;
    if (!allowedByFlags) {
      return false;
    }
    const allowedByKind = ['Property', 'Method'].indexOf(item.kindString) !== -1;
    return allowedByKind;
  }

  getAllowedMembers(item: ApiItem): ApiItem[] {
    return item.children.filter(this.isItemAllow);
  }

  getGithubSourceLinks(item: ApiItem) {
    return utility.getSourceLink(item);
  }

  createMethodString(methodItem: MethodItem) {
    return this.utility.createMethodString(methodItem, this.indexes);
  }
}
