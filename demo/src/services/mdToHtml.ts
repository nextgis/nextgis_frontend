import showdown from 'showdown';
import showdownHighlight from 'showdown-highlight';

const converter = new showdown.Converter({
  extensions: [
    showdownHighlight({
      pre: true,
    }),
  ],
});

export function mdToHtml(md: string): string {
  return converter.makeHtml(md);
}
