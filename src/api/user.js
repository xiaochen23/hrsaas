import request from '@/utils/request'

/**
 * 登录接口封装
 */
export function login(data) {
  // 返回一个promise对象
  return request({
    method: 'POST',
    url: '/sys/login',
    data
  })
}

/**
 * 获取用户资料
 */
export function getUserInfo() {
  return request({
    method: 'POST',
    url: '/sys/profile'
  })
}

/**
 * 根据用户id获取用户详情
 */
export function getUserDetailById(id) {
  return request({
    // 默认请求方法是GET
    url: `/sys/user/${id}`
  })
}

export function logout() {

}
