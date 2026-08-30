import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import plaintext from 'highlight.js/lib/languages/plaintext';
import xml from 'highlight.js/lib/languages/xml';
import lightTheme from 'highlight.js/styles/github.css?inline';
import darkTheme from 'highlight.js/styles/github-dark.css?inline';

const addTheme = (css: string, media: string) => {
  const style = document.createElement('style');
  style.media = media;
  style.textContent = css;
  document.head.append(style);
};

addTheme(lightTheme, '(prefers-color-scheme: light)');
addTheme(darkTheme, '(prefers-color-scheme: dark)');

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('plaintext', plaintext);

export { hljs };
