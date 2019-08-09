import { mixins } from 'vue-class-component';
// import { Vue, Component, Watch } from 'vue-property-decorator';

import { MainPage } from './MainPage';

export class ExampleOutsidePage extends mixins(MainPage) {}
