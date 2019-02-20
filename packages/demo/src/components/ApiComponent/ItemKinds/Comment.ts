import { Vue, Component, Prop } from 'vue-property-decorator';
import { ApiComment } from '../ApiItem';

@Component
export class Comment extends Vue {
  @Prop() text: string;
  @Prop() comment: ApiComment;

  get str() {
    const text = this.comment ? this.comment.shortText : this.text;
    return this._prepareStr(text);
  }

  _prepareStr(text: string): string {
    // `code` > <span>code</span>
    text = text.replace(/`(.+)`/g, '<span class="code">$1</span>');
    // {@link url | name}
    text = text.replace(/{@link (.+) \| (.+)}/g, '<a href="$1" target="_blank">$2</a>');
    return text;
  }

}
