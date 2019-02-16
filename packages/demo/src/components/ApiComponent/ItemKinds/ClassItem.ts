import { Vue, Component, Prop } from 'vue-property-decorator';
import { ClassItem, ApiItem } from '../ApiItem';

@Component
export class ClassItemComponent extends Vue {
  @Prop() item: ClassItem;

  isItemAllow(item: ApiItem): boolean {
    return item.flags.isPrivate !== undefined ? !item.flags.isPrivate : true;
  }
}
