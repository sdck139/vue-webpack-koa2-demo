// import 'font-awesome/css/font-awesome.css'
import './styles/common.styl'
import './styles/normalize.css'
import Vue from 'vue'
import VueTouchRipple from 'vue-touch-ripple'
import './scripts/axios'
import './scripts/filter'
import './scripts/directive'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import VueRouter from 'vue-router'
import Index from './pages/Index.vue'

Vue.use(MintUI)
Vue.use(VueTouchRipple)
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Index,
      meta: {
        keepAlive: true
      }
    }
  ]
})

const app = new Vue({ router })

app.$mount('#app')

if (module.hot) {
  module.hot.accept()
}
