import { Component, Prop, Vue } from 'vue-property-decorator';

import { mdToHtml } from '../../services/mdToHtml';

import type { Item } from '../../MainPage';

@Component
export class Readme extends Vue {
  @Prop() item: Item;

  get html(): string {
    if (this.item.html) {
      return this.item.html;
    } else if (this.item.md) {
      return mdToHtml(this.item.md);
    }
    return '';
  }

  mounted() {
    // @ts-ignore
    this.$vuetify.goTo(0, { duration: 0 });
  }
}
