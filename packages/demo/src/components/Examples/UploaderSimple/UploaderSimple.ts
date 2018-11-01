import { Vue, Component } from 'vue-property-decorator';
import NgwUploader from '@nextgis-apps/ngw-uploader';

@Component
export class UploaderSimple extends Vue {

  sourcecode = `
  <body>
    <div>
      <div id='uploader'></div>
      <p id='status'></p>
    </div>

    <script src="https://unpkg.com/@nextgis-apps/ngw-uploader@0.0.2/lib/ngw-uploader.js"></script>

    <script>

      const uploader = document.getElementById('uploader');
      const status = document.getElementById('status');

      const ngwUploader = new window.NgwUploader({
        baseUrl: 'http://dev.nextgis.com/sandbox'
      });

      ngwUploader.emitter.on('status:change', function (evt) {
        status.innerHTML = evt.message;
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
              status.innerHTML += '</br>' + evt.data.message;
            }
            color = 'darkred';
            break;
          default:
            color = 'black';
        }
        status.style.color = color;
      });

      const input = ngwUploader.createInput();
      uploader.appendChild(input);

    </script>
  </body>
  `;

  mounted() {

    const uploader = document.getElementById('uploader');
    const status = document.getElementById('status');
    const ngwUploader = new NgwUploader({
      baseUrl: 'http://dev.nextgis.com/sandbox'
    });

    ngwUploader.emitter.on('status:change', function (evt) {
      status.innerHTML = evt.message;
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
            status.innerHTML += '</br>' + evt.data.message;
          }
          color = 'darkred';
          break;
        default:
          color = 'black';
      }
      status.style.color = color;
    });

    const input = ngwUploader.createInput();
    uploader.appendChild(input);
  }
}
