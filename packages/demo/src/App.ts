import { Vue, Component, } from 'vue-property-decorator';
import { AppPages } from './store/modules/app';
import HtmlExample from './components/Examples/HtmlExample/HtmlExample.vue';

@Component
export class App extends Vue {

  drawer = null;

  current = null;

  items = null;

  get page(): AppPages {
    return this.$store.state.app.page;
  }

  set page(value: AppPages) {
    this.$store.dispatch('app/setPage', value);
  }

  mounted() {

    this.items = [
      {
        icon: 'keyboard_arrow_up',
        'icon-alt': 'keyboard_arrow_down',
        text: 'WebMap',
        model: true,
        children: [
          {
            text: 'NGW Leaflet add layer from cloud',
            description: `
              A simple example showing how create ngw-leaflet map and add some image layer from cloud.
            `,
            component: HtmlExample,
            source: require('../../ngw-leaflet/examples/ngw_layer.html')
          },

        ]
      },
      {
        icon: 'keyboard_arrow_up',
        'icon-alt': 'keyboard_arrow_down',
        text: 'Uploader',
        model: true,
        children: [
          {
            text: 'Raster upload simple example',
            description: `
              A simple example showing how to use ngw-uploader.js to upload a GEOTIFF to the NextgisWeb cloud.
            `,
            component: HtmlExample,
            source: require('../../ngw-uploader/examples/simple_input.html')
          },
          {
            text: 'Raster upload with map',
            description: `
            This example shows how to add a newly created raster on the map.
            `,
            source: require('../../ngw-uploader/examples/custom_input.html'),
            component: HtmlExample,
          }
        ]
      }
    ];

    this.current = this.items[0].children[0];
  }

}
