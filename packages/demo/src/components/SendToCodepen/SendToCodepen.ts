import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import './images/codepen.svg';

interface PenData {
  html?: string;
  css?: string;
  js?: string;

}

@Component
export class SendToCodepen extends Vue {

  @Prop() html: string;

  @Watch('html')
  updateForm(data) {
    this._createForm( this._parseHtml(data));
  }

  mounted() {
    if (this.html) {
      this.updateForm(this.html);
    }
  }

  _parseHtml(html: string): PenData {
    const parseTag = (tag) => {
      const re = new RegExp(`<${tag}>((.|[\n\r])*)<\/${tag}>`, 'i');
      const match = html.match(re);
      if (match && match.length) {
        html = html.replace(match[0], '');
        return match[1] || '';
      }
      return '';
    };
    const js = parseTag('script').trim();
    const css = parseTag('style').trim();
    return {
      html,
      js,
      css
    };
  }

  _createForm(data: PenData) {
    const value = JSON.stringify(data)
      // Quotes will screw up the JSON
      .replace(/"/g, '&​quot;')
      .replace(/'/g, '&apos;');
    const form = document.createElement('form');
    form.setAttribute('action', 'https://codepen.io/pen/define');
    form.setAttribute('method', 'POST');
    form.setAttribute('target', '_blank');
    form.innerHTML = `
      <input type="hidden" name="data" value="
        ${value}
      ">
      <input type="image"
      src="./codepen.svg"
      width="40"
      height="40"
      value="Create New Pen with Prefilled Data"
      title="open in codepen"
      class="codepen-mover-button">
    `;

    this.$el.innerHTML = '';
    this.$el.appendChild(form);
  }
}
