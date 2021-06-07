import type { ImageTypes } from '../interfaces';

export const imageTypesAccept: { [format: string]: ImageTypes[] } = {
  tiff: ['image/tif', 'image/tiff', '.tif'],
};
