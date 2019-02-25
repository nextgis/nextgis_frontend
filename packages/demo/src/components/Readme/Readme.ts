import { Vue, Component, Prop } from 'vue-property-decorator';
import { Item } from '../../MainPage';

@Component
export class Readme extends Vue {

  @Prop() item: Item;

  mounted() {
    // @ts-ignore
    this.$vuetify.goTo(0, {duration: 0});
  }

}
