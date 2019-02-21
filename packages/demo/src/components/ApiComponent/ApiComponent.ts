import { Vue, Component, Prop } from 'vue-property-decorator';
import ClassItem from './ItemKinds/ClassItem.vue';

@Component({
  components: { ClassItem }
})
export class ApiComponent extends Vue {

  @Prop() api: any;
  @Prop() package: string;

  mounted() {
    // @ts-ignore
    hljs.initHighlightingOnLoad();
    const hash = window.location.hash;
    if (hash) {
      // @ts-ignore
      this.$root.goTo(hash, {duration: 0});
    } else {
      // @ts-ignore
      this.$vuetify.goTo(0, {duration: 0});
    }
  }
}
