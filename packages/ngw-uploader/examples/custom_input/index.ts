import NgwMap from '@nextgis/ngw-leaflet';
import NgwUploader from '@nextgis/ngw-uploader';

const template = document.getElementById(
  'control-element',
) as HTMLTemplateElement;
const element = document.importNode(
  template.content.firstElementChild!,
  true,
) as HTMLElement;

const statusUpload = element.querySelector<HTMLElement>('#status')!;
const input = element.querySelector<HTMLInputElement>('#resource-input')!;
const baseUrl = 'https://sandbox.nextgis.com';
const ngwUploader = new NgwUploader({
  baseUrl: baseUrl,
  useTus: false,
});

const ngwMap = new NgwMap({
  baseUrl: baseUrl,
  target: 'map',
  qmsId: 448,
  bounds: [30, 20, 180, 70],
});

const control = ngwMap.createControl(
  {
    onAdd: () => {
      return element;
    },
    onRemove: () => {},
  },
  { margin: true },
);
ngwMap.addControl(control, 'top-right');

ngwUploader.emitter.on('status:change', (evt) => {
  statusUpload.innerHTML = evt.message ?? '';
});

input.addEventListener('change', () => {
  const file = input.files?.[0];
  if (!file) {
    return;
  }
  ngwUploader
    .uploadRaster(file, {
      addTimestampToName: true,
      parentId: 0,
    })
    .then((newStyle) => {
      ngwMap.addNgwLayer({ resource: newStyle.id }).then((layer) => {
        if (!layer) {
          throw new Error('Raster layer was not added');
        }
        ngwMap.zoomToLayer(layer);
      });
    });
});
