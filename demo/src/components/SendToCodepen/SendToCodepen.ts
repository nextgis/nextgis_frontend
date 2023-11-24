import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

import codepenIcon from './images/codepen.svg';

import type { Item } from '../../MainPage';

interface PenData {
  html?: string;
  css?: string;
  js?: string;
  title?: string;
  description?: string;
  html_pre_processor?: 'none';
  css_pre_processor?: 'none';
  css_starter?: 'neither';
  css_prefix_free?: boolean;
  js_pre_processor?: 'none';
  js_modernizr?: boolean;
  js_library?: string;
  html_classes?: string;
  css_external?: string;
  js_external?: string;
  template?: boolean;
}

@Component
export class SendToCodepen extends Vue {
  @Prop() item: Item;

  @Watch('item.html')
  updateForm(data) {
    this._createForm(this._parseHtml(data));
  }

  mounted() {
    if (this.item.html) {
      this.updateForm(this.item.html);
    }
  }

  _tabLeft(text) {
    const lines = text.split('\n');
    let newTextArr: string[] = [];
    const emptyCharsCounts = [];
    let noEmptyLinesOnBegin = false;
    for (let fry = 0; fry < lines.length; fry++) {
      let line = lines[fry];
      line = line.replace('\r', '');
      const isLineNotEmpty = !!line;
      if (noEmptyLinesOnBegin || isLineNotEmpty) {
        noEmptyLinesOnBegin = true;
        newTextArr.push(line);
        if (isLineNotEmpty) {
          const emptyLines = line.search(/\S/);
          if (emptyLines !== -1) {
            emptyCharsCounts.push(emptyLines);
          }
        }
      }
    }
    const minEmptyChars = Math.min(...emptyCharsCounts);
    if (minEmptyChars) {
      newTextArr = newTextArr.map((x) => x.substring(minEmptyChars));
    }
    return newTextArr.join('\n');
  }

  _parseHtml(html: string): PenData {
    const parseTag = (tag) => {
      const re = new RegExp(`<${tag}>((.|[\n\r])*)</${tag}>`, 'i');
      const match = html.match(re);
      if (match && match.length) {
        html = html.replace(match[0], '');
        return match[1] || '';
      }
      return '';
    };
    const js = this._tabLeft(parseTag('script'));
    const css = this._tabLeft(parseTag('style'));

    return {
      title: `${this.item.name} | ${this.item.id}`,
      description: '',
      html,
      html_pre_processor: 'none',
      css,
      css_pre_processor: 'none',
      css_starter: 'neither',
      css_prefix_free: false,
      js,
      js_pre_processor: 'none',
      js_modernizr: false,
      js_library: '',
      html_classes: '',
      css_external: '',
      js_external: '',
      template: true,
    };
  }

  _createForm(data: PenData) {
    const value = JSON.stringify(data)
      // Quotes will screw up the JSON
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
    this.$el.innerHTML = `
    <form action="https://codepen.io/pen/define" method="POST" target="_blank">
      <input type="hidden" name="data" value='${value}'>
      <input type="image"
        src="${codepenIcon}"
        class="codepen-mover-button"
        width="40"
        height="40"
        value="Create New Pen with Prefilled Data">
    </form>
    `;
    // this.$el.appendChild(form);
  }
}
