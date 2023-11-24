import type { NgwUploadOptions } from '@nextgis/ngw-uploader';

export interface NgwUploadInputOptions extends NgwUploadOptions {
  loginDialog?: boolean;
  inputOptions?: UploadInputOptions;
}

export interface UploadInputOptions {
  html?: string;
  name?: string;
  parentId?: number;
  addTimestampToName?: boolean;
  success?: (newRes: ResourceCreateResp) => void;
  error?: (er: Error) => void;
  createName?: (name: string) => string;
  element?: string | HTMLElement;
  image?: boolean;
  vector?: boolean;
}

interface ResourceCreateResp {
  id: number;
  name?: string;
  parent?: { id: number };
}
