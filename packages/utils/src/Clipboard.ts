export class Clipboard {
  constructor(text: string) {
    if (text) {
      this.copy(text);
    }
  }

  static copy = (text: string) => {
    return new Clipboard(text);
  };

  copy(text: string) {
    try {
      if ((navigator as any).clipboard) {
        (navigator as any).clipboard.writeText(text);
      } else if ((window as any).clipboardData) {
        (window as any).clipboardData.setData('text', text);
      } else {
        this.copyToClipboard(text);
      }
      console.log('Copied to Clipboard');
    } catch (e) {
      console.log('Please copy coupon manually');
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
