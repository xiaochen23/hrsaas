import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Promise } from 'core-js'
import { Message } from 'element-ui'
import { getTimeStamp } from './auth'

const TimeOut = 7200 // 定义超时时间
const service = axios.create({
  // 当执行 npm run dev => .env.development => /api => 跨域代理
  baseURL: process.env.VUE_APP_BASE_API, // npm run dev => /api  npm run build => /prod-api
  timeout: 5000 // 设置超时时间
})
// 请求拦截器
service.interceptors.request.use(config => {
  // 注入token
  if (store.getters.token) {
    // // 只有再有token的情况下，才有必要检查时间戳是否超时
    if (isTimeOut()) {
      // 如果为true 表示token过期
      store.dispatch('user/logout') // 退出操作
      router.push('/login') // 跳转登录页
      return Promise.reject(new Error('token超时了')) // 提示超时信息
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config // config 是请求的配置信息 必须要返回的
}, error => {
  return Promise.reject(error)
})
// 响应拦截器
service.interceptors.response.use((response) => {
  // axios默认加了一层data
  const { success, message, data } = response.data
  if (success) {
    return data
  } else {
    // 业务已经错误，不能进then，应该进catch
    Message.error(message) // 提示错误信息
    return Promise.reject(new Error(message))
  }
}, (error) => {
  // error 信息里面 响应的对象
  if (error.response && error.response.data && error.response.data.code === 10002) {
    // 当等于10002的时候表示后端提示token超时了
    store.dispatch('user/logout') // 退出操作
    router.push('/login') // 跳转登录页
  } else {
    Message.error(error.message) // 提示错误信息
  }
  return Promise.reject(error) // 返回执行错误，让当前的执行链跳出成功，直接进入catch
})

// 判断是否超时
// 超时逻辑 (当前时间 - 缓存中的时间) 是否大于时间差
function isTimeOut() {
  var currentTime = Date.now() // 当前时间戳
  var timeStamp = getTimeStamp() // 缓存时间戳
  return (currentTime - timeStamp) / 1000 > TimeOut
}
export default service
