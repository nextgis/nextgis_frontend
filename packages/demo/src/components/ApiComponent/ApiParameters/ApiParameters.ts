import { Vue, Component, Prop } from 'vue-property-decorator';
import { ApiItem, ConstructorItem, Parameter } from '../ApiItem';
import ApiOption from '../ApiOption/ApiOption.vue';

@Component({
  components: { ApiOption }
})
export class ApiParameters extends Vue {
  @Prop() item: ConstructorItem;

  get parameters() {
    if (this.item) {
      const parameters: Parameter[] = [];
      this.item.signatures.forEach((x) => x.parameters.forEach((y) => parameters.push(y)));
      return parameters.sort((a, b) => {
        const x = a.flags.isOptional;
        const y = b.flags.isOptional;
        return (x === y) ? 0 : x ? 1 : -1;
      });
    }
    return [];
  }

}
