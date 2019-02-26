import { Vue, Component, Prop } from 'vue-property-decorator';
import { ApiItem, Parameter } from '../ApiItem';
import ApiOption from '../ApiOption/ApiOption.vue';

@Component({
  components: { ApiOption }
})
export class Reference extends Vue {
  @Prop() parameter: Parameter;

  get reference(): ApiItem {

    const indexes = this.$store.state.api.indexes;
    if (indexes && 'id' in this.parameter.type) {
      return indexes[this.parameter.type.id];
    }
  }

  get link(): string {
    const reference = this.reference;
    if (reference && 'name' in this.parameter.type) {
      return `${reference.module.name}-api#${this.parameter.type.name}`;
    }
  }

  goTo() {
    const reference = this.reference;
    if (reference && 'name' in this.parameter.type) {
      const name = this.parameter.type.name;
      const element = document.getElementById(name);
      if (element) {
        // @ts-ignore
        this.$root.goTo(name);
      } else {
        this.$router.push(`${reference.module.name}-api#${name}`);
      }
    }
  }
}
