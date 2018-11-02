import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export class HtmlExample extends Vue {

  @Prop() source: string;
  @Prop() text: string;
  @Prop() description: string;

  mounted() {
    const iframe = document.getElementById('example-iframe') as HTMLFrameElement;
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(this.source);
    doc.close();

  }
}
