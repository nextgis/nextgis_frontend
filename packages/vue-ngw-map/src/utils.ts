import Vue from 'vue';
import { VueNgwMap } from './VueNgwMap';

export const findNgwMapParent = (firstVueParent: Vue | VueNgwMap): VueNgwMap => {
  let found = false;
  while (firstVueParent && !found) {
    if (!('ngwMap' in firstVueParent)) {
      firstVueParent = firstVueParent.$parent;
    } else {
      found = true;
    }
  }
  return firstVueParent as VueNgwMap;
};
