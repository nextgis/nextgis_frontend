import { Marked, Renderer } from 'marked';
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
  const headings = new Map<string, number>();
  const renderer = new Renderer();

  renderer.heading = (text, level) => {
    const base = text
      .replace(/<[^>]+>/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^\p{L}\p{M}\p{N}_\s-]/gu, '')
      .replace(/\s+/g, '-');
    const count = headings.get(base) ?? 0;
    headings.set(base, count + 1);
    const id = count ? `${base}-${count}` : base;

    return `<h${level} id="${id}">${text}</h${level}>`;
  };

  return marked.parse(md, { renderer });
}
