import { ApiItem } from '../../components/ApiComponent/ApiItem';

function forEachApi(
  cb: (item: ApiItem, parent?: ApiItem) => void,
  item: ApiItem,
  parent?: ApiItem
): ApiItem | undefined {
  cb(item, parent);
  if (item.children) {
    for (let fry = 0; fry < item.children.length; fry++) {
      const c = item.children[fry];
      const childItem = forEachApi(cb, c, item);
      if (childItem) {
        return childItem;
      }
    }
  }
}

function createIndexes(item: ApiItem) {
  const idx = {};
  forEachApi((i, p) => {
    idx[i.id] = i;
    if (p) {
      if (p.kindString === 'External module') {
        i.module = p;
      } else if (p.module) {
        i.module = p.module;
      }
    }
  }, item);
  return idx;
}

export interface Indexes {
  [id: number]: ApiItem;
}

function findInApi(
  cb: (item: ApiItem) => boolean,
  item?: ApiItem
): ApiItem | undefined {
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

function findApiModule(name: string, item: ApiItem): ApiItem {
  if (item && item.children) {
    const modules = item.children;
    return modules.find(x => {
      return x.name === name;
    });
  }
}

const _state = {
  api: {},
  indexes: {}
};

// getters
const _getters = {
  getApiItemById: state => (id: number) => {
    return state.api[id];
  },

  getApiModule: state => (name: string, item?: ApiItem) => {
    item = item || state.api;
    return findApiModule(name, item);
  },

  findInApi: state => (cb: (item: ApiItem) => boolean, item: ApiItem) => {
    item = item || state.api;
    return findInApi(cb, item);
  }
};

const actions = {
  loadApi: async ({ commit }, ngwMap: string) => {
    try {
      // const api = await import('../../api.json');
      // commit('updateApi', api);
      // return api;
    } catch (er) {
      // ignore
    }
  }
};

const mutations = {
  updateApi(state: any, api: any) {
    state.api = api;
    state.indexes = createIndexes(api);
  }
};

export default {
  namespaced: true,
  state: _state,
  getters: _getters,
  actions,
  mutations
};
