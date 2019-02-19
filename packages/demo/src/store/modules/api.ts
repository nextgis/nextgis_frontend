// initial state
// shape: [{ id, quantity }]

export type AppPages = string;
export interface AppState {
  drawer?: boolean;
  page?: AppPages;
  center?: [number, number];
}

const _state: AppState = {
  page: 'main',
};

// getters
const _getters = {};

// actions
const actions = {

  setPage({commit}, page: AppPages) {
    commit('setPage', page);
  },

};

// mutations
const mutations = {

  setPage(state, page: AppPages) {
    state.page = page;
  },

  setCenter(state, id: number) {
    state.center = id;
  }

};

export default {
  namespaced: true,
  state: _state,
  getters: _getters,
  actions,
  mutations
};
