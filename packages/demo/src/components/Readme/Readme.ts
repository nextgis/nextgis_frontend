import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export class Readme extends Vue {

  @Prop() html: string;

}
