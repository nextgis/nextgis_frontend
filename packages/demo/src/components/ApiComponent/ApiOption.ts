import { Vue, Component, Prop } from 'vue-property-decorator';
import ClassItem from './ItemKinds/ClassItem.vue';
import Comment from './ItemKinds/Comment.vue';
import { ApiItem, InterfaceItem, Parameter, Property } from './ApiItem';
import * as utility from './utility';

@Component({
  components: { ClassItem, Comment }
})
export class ApiOption extends Vue {
  @Prop() id: number;

  utility = utility;

  get indexes(): { [id: number]: ApiItem } {
    return this.$store.state.api.indexes;
  }

  get option(): InterfaceItem {
    const option = this.indexes[this.id];
    if (option.kindString === 'Interface') {
      return option as InterfaceItem;
    }
  }

  get properties(): Parameter[] {
    const children  = this.option.children.filter((x) => !!x.type);
    return children;
  }

  getOptionType(option: Property): string {
    return this.utility.getOptionType(option, this.indexes);
  }

}
