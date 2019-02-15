import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export class ApiComponent extends Vue {

  @Prop() api: any;
  @Prop() package: string;
}
