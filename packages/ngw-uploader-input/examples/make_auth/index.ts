import NgwUploaderInput from '@nextgis/ngw-uploader-input';

const uploader = document.getElementById('uploader') as HTMLDivElement;
const statusUpload = document.getElementById('status') as HTMLDivElement;

const ngwUploader = new NgwUploaderInput({
  baseUrl: 'https://sandbox.nextgis.com',
  auth: {
    login: 'administrator',
    password: 'demodemo',
  },
});

ngwUploader.emitter.on('status:change', function (evt) {
  statusUpload.innerHTML = evt.message ?? '';
});

const input = ngwUploader.createInput({
  addTimestampToName: true,
  parentId: 0,
});
uploader.appendChild(input);
