import type {
  ImageTypes,
  RasterUploadOptions,
  UploadInputOptions,
} from '../interfaces';
import { imageTypesAccept } from './constants';

export function createInput(
  opt: UploadInputOptions = {},
  uploadRaster: (
    file: File,
    options: RasterUploadOptions,
  ) => Promise<any> | undefined,
): HTMLElement {
  const allowImage = opt.image || true;
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  let accept: ImageTypes[] = [];
  if (allowImage) {
    accept = Object.keys(imageTypesAccept).reduce((a: ImageTypes[], b) => {
      const imageTypes = imageTypesAccept[b];
      return a.concat(imageTypes);
    }, []);
  }
  input.setAttribute('accept', accept.join(','));
  if (opt.html) {
    input.innerHTML = opt.html;
  }
  input.addEventListener('change', () => {
    const file = input && input.files && input.files[0];
    if (file) {
      const uploadPromise = uploadRaster(file, opt);
      if (uploadPromise) {
        if (opt.success) {
          uploadPromise.then(opt.success);
        }
        if (opt.error) {
          uploadPromise.then(opt.error);
        }
      }
    }
  });
  if (opt.element) {
    let element;
    if (typeof opt.element === 'string') {
      element = document.getElementById(opt.element);
    } else if (opt.element instanceof HTMLElement) {
      element = opt.element;
    }
    if (element) {
      element.appendChild(input);
    } else {
      throw new Error('target element not founded');
    }
  }
  return input;
}
