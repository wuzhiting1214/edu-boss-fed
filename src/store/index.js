import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 用于在登录成功后保持用户信息
    user: JSON.parse(window.localStorage.getItem('user') || null)
  },
  mutations: {
    // 存储用户数据
    getUser (state, payload) {
      // 将payload转换为对象格式
      state.user = JSON.parse(payload)
      // 将用户数据存储到本地
      window.localStorage.setItem('user', payload)
    }
  },
  actions: {
  },
  modules: {
  }
})
