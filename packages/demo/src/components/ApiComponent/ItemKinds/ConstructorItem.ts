import { Vue, Component, Prop } from 'vue-property-decorator';
import { ConstructorItem, ApiItem, ClassItem } from '../ApiItem';
import * as utility from '../utility';

@Component
export class ConstructorItemComponent extends Vue {

  @Prop() classItem: ClassItem;
  item: ConstructorItem = null;

  utility = utility;

  mounted() {
    this.item = this.classItem.children.find((x) => {
      console.log(x);
      return x.kindString === 'Constructor';
    }) as ConstructorItem;
  }

}
