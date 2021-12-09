import store from '@/store'
// 做一个混入对象
export default {
  // 混入对象是组件的选项对象
  methods: {
    // 检查权限
    checkPermission(key) {
      // 去用户的信息里面找 points中有没有key 如果有key就有权限 没有key则不能点击
      const { userInfo } = store.state.user
      if (userInfo.roles && userInfo.roles.points) {
        return userInfo.roles.points.some(item => item === key)
      }
      return false // 如果没进if 说明没权限
    }
  }
}
