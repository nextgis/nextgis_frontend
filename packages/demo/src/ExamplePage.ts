import { Vue, Component, Watch } from 'vue-property-decorator';

import { MainPage } from './MainPage';

@Component({
  mixins: [MainPage]
})
export class ExamplePage extends Vue {
}
