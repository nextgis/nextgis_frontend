import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export class HtmlExample extends Vue {

  @Prop() source: string;
  @Prop() text: string;
  @Prop() description: string;

  mounted() {
    this._writeIFrame(this.source);
    this.$watch('source', (newVal) => {
      this._writeIFrame(newVal);
    });
  }

  private _writeIFrame(html) {
    const wrapper = document.getElementById('example-iframe') as HTMLFrameElement;
    wrapper.innerHTML = '';
    const iframe = document.createElement('iframe');
    wrapper.appendChild(iframe);
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();
  }
}
