import { Vue, Component, Prop } from 'vue-property-decorator';
import ClassItem from '../ClassItem/ClassItem.vue';
import Comment from '../Comment/Comment.vue';
import { ApiItem, InterfaceItem, Parameter, MethodItem } from '../ApiItem';
import * as utility from '../utility';

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
    if (option && option.kindString === 'Interface') {
      return option as InterfaceItem;
    }
    return undefined;
  }

  get properties(): Parameter[] {
    const option = this.option;
    if (option) {
      const children = option.children.filter(x => {
        return x.type ? true : x.kindString === 'Method';
      });
      return children.sort((a, b) => {
        const x = a.flags.isOptional;
        const y = b.flags.isOptional;
        return x === y ? 0 : x ? 1 : -1;
      });
    }
    return [];
  }

  mounted() {
    // @ts-ignore
    this.$root.updateLinks(this.$el);
  }

  getOptionType(item: ApiItem): string {
    if (item.type) {
      return this.utility.getOptionType(item.type, this.indexes);
    } else if (item.kindString === 'Method') {
      return this.utility.createMethodTypeString(
        item as MethodItem,
        this.indexes
      );
    }
  }
}
