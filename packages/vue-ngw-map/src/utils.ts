import Vue from 'vue';
import VueNgwMap from './components/VueNgwMap';

export function capitalizeFirstLetter(str: string): string {
  if (!str || typeof str.charAt !== 'function') {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

interface VueElement extends Vue {
  [prop: string]: any;
}

export function propsBinder(
  vueElement: VueElement,
  props: Record<string, any>,
): void {
  for (const key in props) {
    const setMethodName = 'set' + capitalizeFirstLetter(key);
    if (key in props && vueElement[setMethodName]) {
      const prop = props[key];
      const deepValue =
        (prop && prop.type === Object) ||
        prop.type === Array ||
        Array.isArray(prop.type);
      vueElement.$watch(
        key,
        (newVal, oldVal) => {
          vueElement[setMethodName](newVal, oldVal);
        },
        {
          deep: deepValue,
        },
      );
    }
  }
}

export const findNgwMapParent = (
  firstVueParent: Vue | VueNgwMap,
): VueNgwMap => {
  let found = false;
  while (firstVueParent && !found) {
    if (!('ngwMap' in firstVueParent)) {
      if (firstVueParent.$parent) {
        firstVueParent = firstVueParent.$parent;
      } else {
        found = true;
        throw new Error(
          'Cant find `ngwMap` property in VueNgwMap component context',
        );
      }
    } else {
      found = true;
    }
  }
  return firstVueParent as VueNgwMap;
};
