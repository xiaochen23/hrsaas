import request from '@/utils/request'

/**
 * 获取组织架构的数据
 */
export function getDepartments() {
  return request({
    url: '/company/department'
  })
}

/**
 * 删除组织架构的部门
 */
export function delDepartments(id) {
  return request({
    method: 'DELETE', // 接口满足restful规范
    url: `/company/department/${id}`
    // 同样的地址，不同的方法，执行不同的业务
    // delete 删除业务
    // get 获取业务
    // post 新增或者添加业务
    // put 修改业务
  })
}

/**
 * 新增部门
 */
export function addDepartments(data) {
  return request({
    method: 'POST',
    url: '/company/department',
    data
  })
}

/**
 * 获取某个部门的详情
 */
export function getDepartDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}

/**
 * 保存编辑的数据
 */
export function updateDepartments(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'PUT',
    data
  })
}
