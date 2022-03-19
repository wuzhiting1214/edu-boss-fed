import request from '@/utils/request'

// 按条件分页查询资源接口
export const getResourcePages = data => {
  return request({
    method: 'POST',
    url: '/boss/resource/getResourcePages',
    data
  })
}

// 查询资源分类接口
export const getResourceCategories = resourceId => {
  return request({
    method: 'GET',
    url: '/boss/resource/category/getAll',
    params: {
      resourceId
    }
  })
}

// 查询资源所有资源
export const getAllResourceList = () => {
  return request({
    method: 'GET',
    url: '/boss/resource/getAll'
  })
}
// 给用户分配资源
export const allocateRoleResources = data => {
  return request({
    method: 'POST',
    url: '/boss/resource/allocateRoleResources',
    data
  })
}

// 获取资源接口
export const getResource = id => {
  return request({
    method: 'GET',
    url: `/boss/resource/${id}`
  })
}

// 保存或更新资源
export const saveOrUpdate = data => {
  return request({
    method: 'POST',
    url: '/boss/resource/saveOrUpdate',
    data
  })
}

// 删除资源接口
export const deleteResource = id => {
  return request({
    method: 'DELETE',
    url: `/boss/resource/${id}`
  })
}

// 保存或更新资源分类接口
export const saveOrderUpdateCategory = data => {
  return request({
    method: 'POST',
    url: '/boss/resource/category/saveOrderUpdate',
    data
  })
}

// 删除资源分类，如果资源分类下有资源，不允许删除
export const deleteResourceCategory = id => {
  return request({
    method: 'DELETE',
    url: `/boss/resource/category/${id}`
  })
}
// // 获取角色拥有的资源列表
// export const getRoleResources = roleId => {
//   return request({
//     method: 'GET',
//     url: '/boss/resource/getRoleResources',
//     params: {
//       roleId
//     }
//   })
// }
