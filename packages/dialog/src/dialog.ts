import dialogPolyfill from 'dialog-polyfill';

import type { DialogAdapter, DialogAdapterOptions } from './interfaces';

import 'dialog-polyfill/dialog-polyfill.css';
import './dialog.css';

const closeBtn = `
  <a href="#">
    <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z">
      </path>
      <path d="M0 0h24v24H0z" fill="none"></path>
    </svg>
  </a>
`;

export class Dialog implements DialogAdapter {
  static dialogs: Dialog[] = [];
  options: DialogAdapterOptions = {
    template: `
      <p>This is dialog!</p>
    `,
    closeBtn: true,
    closeBtnTemplate: closeBtn,
  };
  // TODO: rewrite this component for no browser dialog HTMLDialogElement because is deprecated
  private _dialog: any;
  private _isNativeDialog: boolean;
  private _content: HTMLElement;
  private _parent: Node;
  private _closeBtn?: HTMLElement;

  constructor(options?: DialogAdapterOptions) {
    this._dialog = document.createElement('dialog') as HTMLDialogElement;

    Dialog.dialogs.push(this);

    this._dialog.className = 'dialog-component';
    this.options = { ...this.options, ...options };
    this._parent = this.options.parent || document.body;

    this._isNativeDialog = !!this._dialog.showModal;

    if (!this._isNativeDialog) {
      dialogPolyfill.registerDialog(this._dialog);
      this._dialog.classList.add('polyfilled');
    }

    if (this.options.closeBtn) {
      this._closeBtn = this._createCloseBtn();
    }

    this._content = document.createElement('div');
    this._dialog.appendChild(this._content);

    this.updateContent();

    if (this._parent) {
      this._parent.appendChild(this._dialog);
    }

    this._addEventsListeners();
  }

  static clean(): void {
    Dialog.dialogs.forEach((x) => x.destroy());
  }

  getContainer(): HTMLDialogElement {
    return this._dialog;
  }

  show(): void {
    this._dialog.showModal();
  }

  close(): void {
    this._dialog.close();
  }

  destroy(): void {
    this.close();
    this._dialog.remove();
  }

  updateContent(content?: string | Node): void {
    if (!content && this.options.template) {
      content = this.options.template;
    }
    if (content) {
      this._addContent(content, this._content);
    }
  }

  private _createCloseBtn() {
    const template = this.options.closeBtnTemplate;
    if (template) {
      const btn = document.createElement('div');
      btn.className = 'dialog-component__close';
      this._dialog.appendChild(btn);
      this._addContent(template, btn);

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.close();
      });
      return btn;
    }
  }

  private _addContent(content: string | Node, parent: HTMLElement) {
    if (typeof content === 'string') {
      parent.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      parent.innerHTML = '';
      parent.appendChild(content);
    }
  }

  private _addEventsListeners() {
    if (this._closeBtn) {
      this._closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.close();
      });
    }
    if (this.options.openers) {
      [].forEach.call(this.options.openers, (opener: HTMLElement) => {
        opener.onclick = (e) => {
          e.preventDefault();
          this.show();
        };
      });
    }

    this._dialog.addEventListener('close', () => {
      // console.log('dialog closed');
    });
    this._dialog.addEventListener('cancel', () => {
      // console.log('dialog canceled');
    });
  }
}
