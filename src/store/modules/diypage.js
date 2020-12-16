// initial state
const state = () => ({
  // items: [],
  count: 1000889.888,
  operItem: {},
  pageInfo: {},
  activeTab: 'base',
  pageWrapList: []
})

// getters
const getters = {
  countNum: state => {
    return state.count
  }
}

// actions
const actions = {
  addCount({ commit }, num) {
    commit('addCount', num)
  }
}

// mutations
const mutations = {
  setOperItem(state, operItem) {
    state.operItem = operItem
  },
  setPageInfo(state, pageInfo) {
    state.pageInfo = pageInfo
  },
  setPageWrapList(state, pageWrapList) {
    state.pageWrapList = pageWrapList
  },
  setActiveTab(state, tab) {
    state.activeTab = tab
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
