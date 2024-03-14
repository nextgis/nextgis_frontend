import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';

import { hljs } from '../plugins/highlight';

const marked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    },
  }),
);

export async function mdToHtml(md: string): Promise<string> {
  return marked.parse(md);
}
