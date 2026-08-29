import NgwUploaderInput from '@nextgis/ngw-uploader-input';

const uploader = document.getElementById('uploader') as HTMLDivElement;
const statusUpload = document.getElementById('status') as HTMLDivElement;

const ngwUploader = new NgwUploaderInput({
  baseUrl: 'https://sandbox.nextgis.com',
});

ngwUploader.emitter.on('status:change', function (evt) {
  statusUpload.innerHTML = evt.message ?? '';
});

const createInput = function () {
  const input = ngwUploader.createInput({
    parentId: 0,
    // Way to change resource name
    createName: function (name) {
      return name + '-' + new Date().getTime();
    },
    success: function (newStyle) {
      // Refresh input
      createInput();
      ngwUploader.createWms({ ...newStyle, parentId: 0 });
    },
    error: function (er) {
      // Refresh input
      createInput();
      console.log(er);
    },
  });
  uploader.innerHTML = '';
  uploader.appendChild(input);
};
createInput();
