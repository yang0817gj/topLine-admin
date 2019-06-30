import Vue from 'vue'
import App from './App.vue'

// 优先查找文件，如果文件找不到则找目录
// 找到目录，优先加载目录中的index.js
import router from './router'
import store from './store'
import './styles/index.less'
import 'nprogress/nprogress.css'
import JSONbig from 'json-bigint'
import ElementUl from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import axios from 'axios'

axios.defaults.transformResponse = [function (data) {
  // data 是未经处理的后端响应数据：JSON 格式字符串
  // Do whatever you want to transform the data

  try {
    // data 数据可能不是标准的 JSON 格式字符串，否则会导致 JSONbig.parse(data) 转换失败报错
    return JSONbig.parse(data)
  } catch (err) {
    // 无法转换的数据直接原样返回
    return data
  }
}]

axios.interceptors.request.use(config => {
  // Do something before request is sent
  console.log(config)
  const userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
  if (userInfo) {
    config.headers.Authorization = `Bearer ${userInfo.token}`
  }

  return config
}, error => {
  // Do something with request error
  // console.log('response error => ', error)
  return Promise.reject(error)
})

// Add a response interceptor
axios.interceptors.response.use(response => {
  // Do something with response data
  // return response.data.data
  console.log(response)
  // console.log('response => ', response)
  if (typeof response.data === 'object') {
    return response.data.data
  } else {
    return response.data
  }
}, error => {
  const status = error.response.status
  if (status === 401) {
    window.localStorage.removeItem('userInfo')
    router.push({
      name: 'login'
    })
  }
  // Do something with response error
  return Promise.reject(error)
})

Vue.prototype.$http = axios
// axios.defaults.baseURL = 'http://toutiao.course.itcast.cn/mp/v1_0/'
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'

Vue.use(ElementUl)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
