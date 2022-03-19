import axios from 'axios'
// 引入store
import store from '@/store'
// 引入element的message功能
import { Message } from 'element-ui'
// 引入router
import router from '@/router'
// 引入qs
import qs from 'qs'

// create创建axios实例
const request = axios.create({
  timeout: 10000
  // baseUrl
  // method
})

function getBaseURL (url) {
  if (url.startsWith('/boss')) {
    return 'http://eduboss.lagounews.com'
  } else {
    return 'http://edufront.lagounews.com'
  }
}

// 请求拦截器
request.interceptors.request.use(function (config) {
  config.baseURL = getBaseURL(config.url)

  // 统一设置token
  const { user } = store.state
  if (user && user.access_token) {
    config.headers.Authorization = user.access_token
  }
  return config
})

function redirectLogin () {
  router.push({
    name: 'login',
    query: {
      // currentRoute就是存储了路由信息的对象
      redirect: router.currentRoute.fullPath
    }
  })
}

// 存储是否正在更新token的状态
let isRefreshing = false
// 存储因为等待token刷新而挂起的请求
let requests = []

// 响应拦截器
request.interceptors.response.use(function (response) {
  // 状态码为 2xx 时执行这里
  // console.log('响应成功')
  return response
}, function (error) {
  if (error.response) {
    // 请求发送成功，响应接收完毕，但状态码为失败的情况
    // 1 判断失败时状态码情况（主要处理401）
    const { status } = error.response
    let errorMessage = ''
    if (status === 400) {
      errorMessage = '请求参数错误'
    } else if (status === 401) {
      // 1.无token 信息
      if (!store.state.user) {
        // 跳转到登录页
        redirectLogin()
        return Promise.reject(error)
      }
      // 2.Token 无效（过期）处理

      // 检测是否存在了正在刷新token的请求
      if (isRefreshing) {
        // 将当前失败的请求存储到请求列表中
        return requests.push(() => {
          // 当函数调用后，会自动发送本次失败的请求
          request(error.config)
        })
      }

      // 手动将isRefreshing 设置为true
      isRefreshing = true

      return request({
        method: 'POST',
        url: '/front/user/refresh_token',
        data: qs.stringify({
          refreshtoken: store.state.user.refresh_token
        })
      }).then(res => {
        // 刷新token失败
        if (res.data.state !== 1) {
          // 清除无用的用户信息
          store.commit('getUser', null)
          // 跳转到登录页
          redirectLogin()
          return Promise.reject(error)
        }
        // 刷新token成功
        // 存储新的token信息
        store.commit('getUser', res.data.content)
        // 重新发送失败的请求
        // error.config本次失败的请求的配置对象
        // return request(error.config)
        requests.forEach(callback => callback())
        // 发送完毕，清空请求列表
        requests = []
        return request(error.config)
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        isRefreshing = false
      })
    } else if (status === 403) {
      errorMessage = '没有权限，请联系管理员'
    } else if (status === 404) {
      errorMessage = '请求资源不存在'
    } else if (status >= 500) {
      errorMessage = '服务端错误，请联系管理员'
    }
    Message.error(errorMessage)
  } else if (error.request) {
    // 请求发送成功，但未收到响应
    console.log(error.request)
  } else {
    // 意料之外的错误
    console.log('Error', error.message)
  }
  // 将拦截器发现的错误继续抛出，让接收响应的处理函数操作
  return Promise.reject(error)
})

export default request
