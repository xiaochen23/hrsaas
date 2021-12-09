// 专门处理权限路由的模块
import { constantRoutes, asyncRoutes } from '@/router'
const state = {
  // 一开始 肯定拥有静态路由的权限
  routes: constantRoutes // 路由表 表示 当前用户所拥有的所有的路由的数组
}
const mutations = {
  // 定义修改routes的mutations
  // payload 载荷 认为是我们登录成功需要添加的新路由
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes] // 每次都是在静态路由的基础上去添加新的路由
  }
}
const actions = {
  // 筛选权限路由
  // 第二个参数为当前用户所拥有的菜单权限
  // menus:['settings','permissions',...]
  // asyncRoutes是所有的动态路由
  // asyncRoutes:[{path:'setting',name:'setting'},{},...]
  filterRoutes(context, menus) {
    const routes = []
    // 筛选出动态路由和menus中能够对上的路由
    menus.forEach(key => {
      // key就是标识
      // asyncRoutes中找有没有对象中的name属性等于key的，如果找不到就没权限，找到了就筛选出来
      routes.push(...asyncRoutes.filter(item => item.name === key)) // 得到一个数组，可能有元素，也可能为空
    })
    // 得到的routes是所有模块中满足权限要求的路由数组
    // routes就是当前用户所拥有的动态路由的权限
    context.commit('setRoutes', routes) // 将动态路由提交给mutations
    return routes // return 是给路由addRoutes用的 state数据是用来显示左侧菜单用的
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
