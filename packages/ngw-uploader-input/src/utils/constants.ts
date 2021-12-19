import type { ImageTypes } from '@nextgis/ngw-uploader';

export const imageTypesAccept: { [format: string]: ImageTypes[] } = {
  tiff: ['image/tif', 'image/tiff', '.tif'],
};
