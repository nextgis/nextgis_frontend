import { Vue, Component, Prop } from 'vue-property-decorator';
import { ConstructorItem, ClassItem } from '../ApiItem';

import ApiParameters from '../ApiParameters.vue';
import * as utility from '../utility';

@Component({
  components: {ApiParameters}
})
export class ConstructorItemComponent extends Vue {

  @Prop() classItem: ClassItem;
  item: ConstructorItem = null;

  utility = utility;

  mounted() {
    this.item = this.classItem.children.find((x) => {
      return x.kindString === 'Constructor';
    }) as ConstructorItem;
  }

}
