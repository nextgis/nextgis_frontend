import { Vue, Component, Prop } from 'vue-property-decorator';
import SendToCodepen from '../../SendToCodepen/SendToCodepen.vue';
import { Item } from 'packages/demo/src/MainPage';

@Component({
  components: { SendToCodepen },
})
export class HtmlExample extends Vue {

  @Prop() item: Item;
  @Prop() fullScreen?: boolean;

  mounted() {
    this._writeIFrame(this.item.html);
    this.$watch('html', (newVal) => {
      this._writeIFrame(newVal);
    });
    // @ts-ignore
    this.$vuetify.goTo(0, {duration: 0});
  }

  openFullPage() {
    if (this.item.id) {
      this.$router.push('/page/' + this.item.id);
    }
  }

  private _writeIFrame(html: string) {
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
