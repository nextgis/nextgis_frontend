import { Vue, Component, Prop } from 'vue-property-decorator';
import { ApiComment, ParameterItem, SignaturedItem } from '../ApiItem';

@Component
export class Example extends Vue {
  @Prop() item: ParameterItem | SignaturedItem;
  @Prop() comment: ApiComment;

  get example() {
    if (this.comment) {
      return this.getExamples(this.comment);
    } else if (this.item) {
      if ('signatures' in this.item) {
        const examples = [];
        this.item.signatures.forEach(x => {
          if ('comment' in x) {
            this.getExamples(x.comment).forEach(y => {
              examples.push(y);
            });
          }
        });
        return examples;
      }
      return this.getExamples(this.item.comment);
    }
    return undefined;
  }

  getExamples(comment: ApiComment): Array<{ language: string; code: string }> {
    if (comment && comment.tags) {
      return comment.tags
        .filter(x => x.tag === 'example')
        .map(x => {
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
