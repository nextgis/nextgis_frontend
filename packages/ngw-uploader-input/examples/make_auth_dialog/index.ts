import NgwUploaderInput from '@nextgis/ngw-uploader-input';

const uploader = document.getElementById('uploader') as HTMLDivElement;
const statusUpload = document.getElementById('status') as HTMLDivElement;

const ngwUploader = new NgwUploaderInput({
  baseUrl: 'https://sandbox.nextgis.com',
  loginDialog: true,
  // default values
  auth: {
    login: 'administrator',
    password: 'demodemo',
  },
});

ngwUploader.emitter.on('status:change', (evt) => {
  statusUpload.innerHTML = evt.message ?? '';
});

ngwUploader.createInput({
  parentId: 0,
  addTimestampToName: true,
  element: uploader,
});
