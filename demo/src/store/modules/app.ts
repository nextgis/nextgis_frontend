export interface AppState {
  defaultNgwMap: string;
}

const _state: AppState = {
  defaultNgwMap: 'ngw-leaflet',
};

// getters
const _getters = {};

// actions
const actions = {
  setDefaultNgwMap({ commit }, ngwMap: string): void {
    commit('setDefaultNgwMap', ngwMap);
  },
};

// mutations
const mutations = {
  setDefaultNgwMap(state: AppState, ngwMap: string): void {
    state.defaultNgwMap = ngwMap;
  },
};

export default {
  namespaced: true,
  state: _state,
  getters: _getters,
  actions,
  mutations,
};
