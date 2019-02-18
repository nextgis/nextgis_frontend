import { Vue, Component, Prop } from 'vue-property-decorator';
import { ConstructorItem, ApiItem, ClassItem } from '../ApiItem';

@Component
export class ConstructorItemComponent extends Vue {

  @Prop() classItem: ClassItem;
  item: ConstructorItem = null;

  mounted() {
    this.item = this.classItem.children.find((x) => {
      console.log(x);
      return x.kindString === 'Constructor';
    }) as ConstructorItem;
  }

  getSignaturesStr(item: ConstructorItem) {
    return item.signatures.map((x) => {
      const parameters = x.parameters.map((p) => {
        return `${p.name}${p.flags.isOptional ? '?' : ''}: ${p.type.name}`;
      });
      const str = `${x.name}(${parameters.join(', ')})`;
      return str;
    });
  }

}
