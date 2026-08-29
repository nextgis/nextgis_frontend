import { Clipboard } from '@nextgis/utils';

function copy() {
  const text = (document.getElementById('copy-input') as HTMLInputElement)
    .value;
  Clipboard.copy(text);
}

(document.getElementById('copy-button') as HTMLButtonElement).addEventListener(
  'click',
  copy,
);
