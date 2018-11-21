import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import axios from 'axios'
import router from './router'

// 添加一个请求拦截器
axios.interceptors.request.use(function (config) {
  return config;
}, function (error) {
  return Promise.reject(error);
});

// 添加一个响应拦截器
axios.interceptors.response.use(function (response) {
  return response.data;
}, function (error) {
  //$message({type: 'warning',message: '请求失败，请稍后重试'});
  alert('请求失败，请稍后重试');
  return Promise.reject(error);
});

Vue.prototype.http = axios
Vue.use(ElementUI)

new Vue({
  router,
  el: '#app',
  render: h => h(App)
})
