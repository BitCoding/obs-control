import Vue from 'vue'
import Vuex, { Payload } from 'vuex'
import VuexPersistence from 'vuex-persist'

import settings from './modules/settings'
import obs from './plugins/obs'
import {RootState} from "@/types";

Vue.use(Vuex)

const vuexLocal = new VuexPersistence<RootState>({
  storage: window.localStorage,
  modules: ['settings']
})

export default new Vuex.Store<RootState>({
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    settings
  },
  plugins: [
      obs,
      vuexLocal.plugin
  ]
})
