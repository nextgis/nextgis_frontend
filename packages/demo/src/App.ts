import { Vue, Component } from 'vue-property-decorator';
import { AppPages } from './store/modules/app';
import AboutComponent from './components/NextGIS/About.vue';
import UploaderSimple from './components/Examples/UploaderSimple/UploaderSimple.vue';

@Component({
  components: { AboutComponent }
})
export class App extends Vue {

  drawer = null;

  currentComponent = UploaderSimple;

  items = [
    {
      icon: 'keyboard_arrow_up',
      'icon-alt': 'keyboard_arrow_down',
      text: 'Uploader',
      model: true,
      children: [
        { text: 'Raster upload simple example', component: UploaderSimple},
        { text: 'Raster upload with map', component: UploaderSimple }
      ]
    }
  ];

  get page(): AppPages {
    return this.$store.state.app.page;
  }

  set page(value: AppPages) {
    this.$store.dispatch('app/setPage', value);
  }

}
