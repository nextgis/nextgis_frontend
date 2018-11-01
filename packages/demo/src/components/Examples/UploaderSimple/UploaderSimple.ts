import { Vue, Component } from 'vue-property-decorator';
import NgwUploader from '@nextgis-apps/ngw-uploader';

@Component
export class UploaderSimple extends Vue {

  mounted() {

    const uploader = document.getElementById('uploader');
    const ngwUploader = new NgwUploader({
      baseUrl: 'http://dev.nextgis.com/sandbox'
    });

    const input = ngwUploader.createInput();
    uploader.appendChild(input);
  }
}
