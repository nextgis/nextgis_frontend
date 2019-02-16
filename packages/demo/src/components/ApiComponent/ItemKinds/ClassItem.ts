import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export class ClassItem extends Vue {
  @Prop() api: any;
}
