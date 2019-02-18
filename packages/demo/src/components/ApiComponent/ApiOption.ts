import { Vue, Component, Prop } from 'vue-property-decorator';
import ClassItem from './ItemKinds/ClassItem.vue';
import { ApiItem } from './ApiItem';

@Component({
  components: { ClassItem }
})
export class ApiOption extends Vue {

  @Prop() optionId: number;
  @Prop() api: ApiItem;
}
