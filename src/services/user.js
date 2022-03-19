import request from '@/utils/request'
import qs from 'qs'

// 用户登录接口
export const login = data => {
  return request({
    method: 'POST',
    // headers: { 'content-type': 'applicant/x-www-form-urlencoded'}
    url: '/front/user/login',
    // urlencoded 格式： 名=值&名=值
    data: qs.stringify(data)
  })
}

// 用户基本信息接口
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/front/user/getInfo'
  })
}

// 分页查询用户信息接口
export const getUserPages = data => {
  return request({
    method: 'POST',
    url: '/boss/user/getUserPages',
    data
  })
}

// 封禁用户接口
export const forbidUser = userId => {
  return request({
    method: 'POST',
    url: '/boss/user/forbidUser',
    params: {
      userId
    }
  })
}
