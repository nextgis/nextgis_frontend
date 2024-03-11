import hljs from 'highlight.js';
import bash from 'highlight.js/lib/languages/bash';
import javascript from 'highlight.js/lib/languages/javascript';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';


// Then register the languages you need
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('bash', bash);

const marked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    }
  })
);

export async function mdToHtml(md: string): Promise<string> {
  return marked.parse(md);
}
