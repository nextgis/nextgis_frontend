import { Vue, Component, Prop } from 'vue-property-decorator';
import {
  ConstructorItem,
  ClassItem,
  PropertyItem,
  MethodItem
} from '../ApiItem';

import ApiParameters from '../ApiParameters/ApiParameters.vue';
import Example from '../Example/Example.vue';
import Comment from '../Comment/Comment.vue';
import * as utility from '../utility';
import { Indexes } from '../../../store/modules/api';

@Component({
  components: { ApiParameters, Example, Comment }
})
export class ConstructorItemComponent extends Vue {
  @Prop() item: ClassItem | PropertyItem | MethodItem;
  constructorItem: ConstructorItem | PropertyItem | MethodItem = null;
  indexes: Indexes;
  utility = utility;

  mounted() {
    this.indexes = this.$store.state.api.indexes;
    if (this.item.children) {
      this.constructorItem = this.item.children.find(x => {
        return x.kindString === 'Constructor';
      }) as ConstructorItem;
    } else if (this.item.kindString === 'Method') {
      this.constructorItem = this.item;
    }
  }

  getSignaturesStr(item: ConstructorItem) {
    const str = this.utility.getConstructorSignatureStr(item, this.indexes);
    return !str
      ? []
      : str.map(x => {
          const tmp = document.createElement('div');
          tmp.innerHTML = x;
          return tmp.innerText;
        });
  }
}
