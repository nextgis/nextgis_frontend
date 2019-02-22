import { Vue, Component, Prop } from 'vue-property-decorator';
import { ApiItem } from '../ApiItem';
import ApiOption from '../ApiOption/ApiOption.vue';

@Component({
  components: {ApiOption}
})
export class ApiParameters extends Vue {
  @Prop() item: ApiItem;
}
