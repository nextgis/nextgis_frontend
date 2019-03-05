import { Vue, Component, Prop } from 'vue-property-decorator';
import { ApiItem, Parameter, MethodItem } from '../ApiItem';
import Reference from '../Reference/Reference.vue';
import * as utility from '../utility';

@Component({
  components: { Reference }
})
export class Property extends Vue {
  @Prop() item: Property;

  utility = utility;

  get indexes(): { [id: number]: ApiItem } {
    return this.$store.state.api.indexes;
  }

  getOptionType(item: ApiItem): string {
    if (item.type) {
      return this.utility.getOptionType(item.type, this.indexes);
    } else if (item.kindString === 'Method') {
      return this.utility.createMethodTypeString(item as MethodItem, this.indexes);
    }
  }

}
