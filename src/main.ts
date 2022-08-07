import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import './plugins/portal-vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false



router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresConnect)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!store.getters["obs/connectionReady"]) {
      next({ name: 'login' })
    } else {
      next() // go to wherever I'm going
    }
  } else {
    next() // does not require auth, make sure to always call next()!
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
