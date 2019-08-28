import { Vue, Component, Prop } from 'vue-property-decorator';
import { ConstructorItem, Parameter } from '../ApiItem';
import ApiOption from '../ApiOption/ApiOption.vue';
import Reference from '../Reference/Reference.vue';
import Property from '../Property/Property.vue';

@Component({
  components: { ApiOption, Reference, Property }
})
export class ApiParameters extends Vue {
  @Prop() item: ConstructorItem;

  get parameters(): Parameter[] {
    if (this.item && this.item.signatures) {
      const parameters: Parameter[] = [];
      this.item.signatures.forEach(x => {
        if (x.parameters) {
          x.parameters.forEach(y => parameters.push(y));
        }
      });
      return parameters.sort((a, b) => {
        const x = a.flags.isOptional;
        const y = b.flags.isOptional;
        return x === y ? 0 : x ? 1 : -1;
      });
    }
    return [];
  }
}
