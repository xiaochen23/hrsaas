import Layout from '@/layout'
// 导出员工的路由规则
export default {
  // 路由规则
  path: '/employees', // 路由地址
  name: 'employees', // 给模块的一级路由加一个name属性，会在后面做权限的时候用到
  component: Layout,
  children: [{
    // 二级路由的path什么都不用写的时候 此时它表示二级路由的默认路由
    path: '', // 这里不用写 表示 /employss 不但有布局 layout
    name: 'employees',
    component: () => import ('@/views/employees'),
    meta: {
      title: '员工管理', // 左侧导航栏读取了这里的title属性
      icon: 'people'
    }
  }, {
    path: 'detail/:id', // 动态路由参数 id后面+'?'表示该参数可传可不传
    component: () => import('@/views/employees/detail'),
    hidden: true,
    meta: {
      title: '员工详情'
    }
  }, {
    path: 'print/:id',
    component: () => import('@/views/employees/print'),
    hidden: true,
    meta: {
      title: '员工打印'
    }
  }]
}
