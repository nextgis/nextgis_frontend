export class Clipboard {
  silent = true;

  constructor(text?: string) {
    if (text) {
      this.copy(text);
    }
  }

  static copy(text: string): Clipboard {
    const clipboard = new Clipboard();
    clipboard.copy(text);
    return clipboard;
  }

  copy(text: string): void {
    try {
      if ((navigator as any).clipboard) {
        (navigator as any).clipboard.writeText(text);
      } else if ((window as any).clipboardData) {
        (window as any).clipboardData.setData('text', text);
      } else {
        this.copyToClipboard(text);
      }
      !this.silent && console.log('Copied to Clipboard');
    } catch (e) {
      !this.silent && console.log('Please copy coupon manually');
    }
  }

  private copyToClipboard(text: string) {
    const input = document.createElement('input') as HTMLInputElement;
    input.value = text;
    try {
      document.body.appendChild(input);
      this.copyNodeContentsToClipboard(input);
    } finally {
      document.body.removeChild(input);
    }
  }

  private copyNodeContentsToClipboard(input: HTMLInputElement) {
    input.select();
    input.setSelectionRange(0, 99999); /*For mobile devices*/
    document.execCommand('copy');
  }
}
