import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'
// 状态
const state = {
  token: getToken(), // 设置token为共享状态，初始化vuex的时候就先从缓存中读取
  userInfo: {} // 定义一个空对象
}
const mutations = {
  setToken(state, token) {
    state.token = token // 将数据设置给vuex
    setToken(token) // 同步给缓存
  },
  removeToken(state) {
    state.token = null // 将vuex数据置空
    removeToken() // 同步到缓存
  },
  setUserInfo(state, result) {
    state.userInfo = result // 这样是响应式
  },
  removeUserInfo(state) {
    state.userInfo = {}
  }

}
const actions = {
  async login(context, data) {
    // 调用api接口
    const result = await login(data) // 拿到token
    context.commit('setToken', result) // 设置token
    // 拿到token说明登录成功
    setTimeStamp() // 设置当前的时间戳
  },
  async getUserInfo(context) {
    const result = await getUserInfo()
    // 获取用户的详情
    const baseInfo = await getUserDetailById(result.userId)
    // 将两个不同接口请求回来的的数据合并提交到mutations
    context.commit('setUserInfo', { ...result, ...baseInfo })
    return result // 这里是给后期做权限的时候留下的伏笔
  },
  // 退出操作
  logout(context) {
    // 删除token
    context.commit('removeToken')
    // 删除用户资料
    context.commit('removeUserInfo')
    // 重置路由
    resetRouter()
    // Vuex子模块怎么调用子模块的actions 都没加锁的情况下 可以随意调用
    // 不加命名空间的情况下 所有的mutations和actions都是挂在全局上的 所以可以直接调用
    // 加了命名空间的context指的不是全局的context
    // 怎么调用： mutations 名称 载荷payload {root:true} 第三个参数表示调用根级的mutations或action
    context.commit('permission/setRoutes', [], { root: true })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
