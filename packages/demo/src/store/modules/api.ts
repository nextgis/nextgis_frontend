import { ApiItem } from '../../components/ApiComponent/ApiItem';

let api: ApiItem | undefined;
let indexes: { [id: number]: ApiItem };
try {
  api = require('../../api.json');
  indexes = createIndexes(api);
} catch (er) {
  // ignore
}

function createIndexes(item: ApiItem) {
  const idx = {};
  forEachApi((i) => {
    idx[i.id] = i;
  }, item);
  return idx;
}

function findInApi(cb: (item: ApiItem) => boolean, item?: ApiItem): ApiItem | undefined {
  const isItem = cb(item);
  if (isItem) {
    return item;
  } else if (item.children) {
    for (let fry = 0; fry < item.children.length; fry++) {
      const c = item.children[fry];
      const childItem = findInApi(cb, c);
      if (childItem) {
        return childItem;
      }
    }
  }
}

function forEachApi(cb: (item: ApiItem) => void, item: ApiItem = api): ApiItem | undefined {
  cb(item);
  if (item.children) {
    for (let fry = 0; fry < item.children.length; fry++) {
      const c = item.children[fry];
      const childItem = forEachApi(cb, c);
      if (childItem) {
        return childItem;
      }
    }
  }
}

function findApiModule(name: string, item: ApiItem): ApiItem {
  if (item && item.children) {
    const modules = item.children;
    return modules.find((x) => {
      return x.name.indexOf(name) !== -1;
    });
  }
}

const _state = {
  api,
  indexes
};

// getters
const _getters = {
  getApiItemById: (state) => (id: number) => {
    return state.api[id];
  },

  getApiModule: (state) => (name: string, item?: ApiItem) => {
    item = item || state.api;
    return findApiModule(name, item);
  },

  findInApi: (state) => (cb: (item: ApiItem) => boolean, item: ApiItem = api) => {
    item = item || state.api;
    return findInApi(cb, item);
  }
};

const actions = {

};

const mutations = {

};

export default {
  namespaced: true,
  state: _state,
  getters: _getters,
  actions,
  mutations
};
