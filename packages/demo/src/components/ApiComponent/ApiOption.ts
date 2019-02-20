import { Vue, Component, Prop } from 'vue-property-decorator';
import ClassItem from './ItemKinds/ClassItem.vue';
import Comment from './ItemKinds/Comment.vue';
import { ApiItem, InterfaceItem, Parameter, Property } from './ApiItem';

@Component({
  components: { ClassItem, Comment }
})
export class ApiOption extends Vue {
  @Prop() id: number;

  get indexes(): { [id: number]: ApiItem } {
    return this.$store.state.api.indexes;
  }

  get option(): InterfaceItem {
    const option = this.indexes[this.id];
    if (option.kindString === 'Interface') {
      return option as InterfaceItem;
    }
  }

  get properties(): Parameter[] {
    const children  = this.option.children.filter((x) => !!x.type);
    return children;
  }

  getOptionType(option: Property): string {
    let str = '';
    if (option.type === 'union') {
      str += option.types.map((x) => this.getOptionType(x)).filter((x) => !!x).join(' | ');
    } else if (option.type === 'intrinsic') {
      if (option.name !== 'undefined') {
        str += option.name;
      }
    } else if (option.type === 'tuple') {
      str += `[${option.elements.map((x) => this.getOptionType(x)).filter((x) => !!x).join(', ')}]`;
    } else if (option.type === 'reference') {
      str += this.createReference(option);
    } else if (option.type === 'reflection') {
      // IG
    }

    return str;
  }

  createReference(option) {
    let str = '';
    const refOption = this.indexes[option.id];
    if (refOption && refOption.type && refOption.type) {
      str += this.getOptionType(refOption.type);
    } else if (option.typeArguments) {
      const args = option.typeArguments.map((x) => this.getOptionType(x)).filter((x) => !!x).join(' | ');
      str += `${option.name}<${args}>`;
    } else {
      str += option.name;
    }
    return str;
  }

  createDeclarationStr(option) {
    // ignore
  }
}
