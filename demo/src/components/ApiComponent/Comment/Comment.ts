import { Vue, Component, Prop } from 'vue-property-decorator';
import { ApiComment, ParameterItem } from '../ApiItem';
import { mdToHtml } from '../../../services/mdToHtml';

@Component
export class Comment extends Vue {
  @Prop() text: string;
  @Prop() comment: ApiComment;
  @Prop() item: ParameterItem;

  get str() {
    const comment =
      this.comment || (this.item && this.item.type && this.item.comment);
    const text = comment ? comment.text || comment.shortText : this.text;
    return this._prepareStr(text);
  }

  _prepareStr(text: string): string {
    if (text) {
      // `code` > <span>code</span>
      // text = text.replace(/`(.+)`/g, '<span class="code">$1</span>');
      // {@link url | name}
      // text = text.replace(/{@link (.+) \| (.+)}/g, '<a href="$1">$2</a>');
      text = text.replace(/{@link (.+) \| (.+)}/g, '[$2]($1)');
      text = text.replace(/#noapi/g, '');
    }
    return mdToHtml(text);
  }
}
