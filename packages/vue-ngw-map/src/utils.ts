import Vue from 'vue';
import { VueNgwMap } from './components/VueNgwMap';

export const capitalizeFirstLetter = (str: string) => {
  if (!str || typeof str.charAt !== 'function') {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
};

interface VueElement extends Vue {
  [prop: string]: any;
}

export function propsBinder(vueElement: VueElement, props: Record<string, any>) {
  for (const key in props) {
    const setMethodName = 'set' + capitalizeFirstLetter(key);
    const prop = props[key];
    const deepValue = prop.type === Object || prop.type === Array || Array.isArray(prop.type);
    if (prop && vueElement[setMethodName]) {
      vueElement.$watch(
        key,
        (newVal, oldVal) => {
          vueElement[setMethodName](newVal, oldVal);
        },
        {
          deep: deepValue
        }
      );
    }
  }
}

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
