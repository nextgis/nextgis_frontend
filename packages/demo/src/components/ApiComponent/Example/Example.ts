import { Vue, Component, Prop } from 'vue-property-decorator';
import { ApiComment, ParameterItem, ApiItem } from '../ApiItem';

@Component
export class Example extends Vue {
  @Prop() item: ParameterItem;
  @Prop() comment: ApiComment;

  get example() {
    if (this.comment) {
      return this.getExamples(this.comment);
    } else if (this.item) {
      return this.getExamples(this.item.comment);
    }
  }

  getExamples(comment: ApiComment): Array<{ language: string, code: string }> {
    if (comment && comment.tags) {
      return comment.tags.filter((x) => x.tag === 'example').map((x) => {
        let language = 'javascript';
        let code = x.text.replace(/```(\w+)/, (e, m) => {
          if (m && e !== m) {
            language = m;
          }
          return '';
        });
        code = code.replace(/```/g, '');
        code = code.replace(/^\s*[\r\n]/gm, '');
        return {
          language,
          code
        };
      });
    }
    return [];
  }

}
