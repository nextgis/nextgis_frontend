import { Vue, Component, Prop } from 'vue-property-decorator';
import { ClassItem, ApiItem } from '../ApiItem';

import ConstructorItemComponent from './ConstructorItem.vue';

@Component({
  components: {ConstructorItemComponent}
})
export class ClassItemComponent extends Vue {
  @Prop() item: ClassItem;

  isItemAllow(item: ApiItem): boolean {
    const allowedByFlags = item.flags.isPrivate !== undefined ? !item.flags.isPrivate : true;
    if (!allowedByFlags) {
      return false;
    }
    const allowedByKind = ['Property', 'Method'].indexOf(item.kindString) !== -1;
    return allowedByKind;
  }

  getAllowedMemders(item: ApiItem): ApiItem[] {
    return item.children.filter(this.isItemAllow);
  }

  getGithubSourceLinks(item: ApiItem) {
    return item.sources.map((x) => {
      return `https://github.com/nextgis/nextgisweb_frontend/blob/master/packages/${x.fileName}#L${x.line}`;
    });
  }
}
