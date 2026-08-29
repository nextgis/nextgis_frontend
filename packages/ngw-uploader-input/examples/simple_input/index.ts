import NgwUploaderInput from '@nextgis/ngw-uploader-input';

const uploader = document.getElementById('uploader') as HTMLDivElement;
const statusUpload = document.getElementById('status') as HTMLDivElement;

const ngwUploader = new NgwUploaderInput({
  baseUrl: 'https://sandbox.nextgis.com',
});

ngwUploader.emitter.on('status:change', function (evt) {
  statusUpload.innerHTML = evt.message ?? '';
  let color;
  switch (evt.state) {
    case 'begin':
      color = 'black';
      break;
    case 'progress':
      color = 'gray';
      break;
    case 'end':
      color = 'green';
      break;
    case 'error':
      if (evt.data.message) {
        statusUpload.innerHTML += '</br>' + evt.data.message;
      }
      color = 'darkred';
      break;
    default:
      color = 'black';
  }
  statusUpload.style.color = color;
});

const input = ngwUploader.createInput({
  parentId: 0,
  addTimestampToName: true,
});
uploader.appendChild(input);
