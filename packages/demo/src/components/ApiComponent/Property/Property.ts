import { Vue, Component, Prop } from 'vue-property-decorator';
import { ApiItem, Parameter, MethodItem, Property as PropertyItem } from '../ApiItem';
import Reference from '../Reference/Reference.vue';
import Comment from '../Comment/Comment.vue';
import * as utility from '../utility';

@Component({
  components: { Reference, Comment }
})
export class Property extends Vue {
  @Prop() item: PropertyItem;

  utility = utility;

  get indexes(): { [id: number]: ApiItem } {
    return this.$store.state.api.indexes;
  }

  get defaultValue() {
    const tags = this.item.comment && this.item.comment.tags;
    const defTag = tags && tags.find((x) => x.tag === 'default');
    if (defTag) {
      return defTag.text;
    }
  }

  getOptionType(item: ApiItem): string {
    if (item.type) {
      return this.utility.getOptionType(item.type, this.indexes);
    } else if (item.kindString === 'Method') {
      return this.utility.createMethodTypeString(item as MethodItem, this.indexes);
    }
  }

}
