/**
 * @alpha
 */
export interface DialogAdapterOptions {
  template?: string | Node;
  openers?: HTMLElement[];
  parent?: Node;
  closeBtn?: boolean;
  closeBtnTemplate?: string | Node;
}

/**
 * @alpha
 */
export interface DialogAdapter {
  options: DialogAdapterOptions;
  show(): void;
  close(): void;
  updateContent(content?: string | Node): void;
}
