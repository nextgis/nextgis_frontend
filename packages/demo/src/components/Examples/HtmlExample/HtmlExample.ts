import { Vue, Component, Prop } from 'vue-property-decorator';
import SendToCodepen from '../../SendToCodepen/SendToCodepen.vue';

@Component({
  components: { SendToCodepen },
})
export class HtmlExample extends Vue {

  @Prop() html: string;
  @Prop() text: string;
  @Prop() description: string;

  mounted() {
    this._writeIFrame(this.html);
    this.$watch('html', (newVal) => {
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
