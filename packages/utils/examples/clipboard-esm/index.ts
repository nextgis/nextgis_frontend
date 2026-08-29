import { Clipboard } from '@nextgis/utils';

const copyButton = document.getElementById('copy-btn') as HTMLButtonElement;
const copyInput = document.getElementById('copy-input') as HTMLInputElement;

copyButton.addEventListener('click', () => {
  Clipboard.copy(copyInput.value);
});
