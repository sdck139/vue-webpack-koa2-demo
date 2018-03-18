import Vue from 'vue'
import axios from 'axios'

Vue.prototype.$http = axios

axios.defaults.baseURL = '/api/v1'
axios.interceptors.response.use(function(resp) {
  return resp
}, function(err) {
  if (err.response.status == 401) {
    window.location.reload()
    return
  }

  return Promise.reject(err)
})
