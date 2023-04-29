import App from './App'
import request from "util/api.js"

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
Vue.prototype.Myrequest = request;

App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif