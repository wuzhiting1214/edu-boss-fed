import request from '@/utils/request'

// 分页查询课程信息
export const getQueryCourses = data => {
  return request({
    method: 'POST',
    url: '/boss/course/getQueryCourses',
    data
  })
}

// 课程上下架接口
export const changeState = params => {
  return request({
    method: 'GET',
    url: '/boss/course/changeState',
    params
  })
}

// 保存或者更新课程信息
export const saveOrUpdateCourse = data => {
  return request({
    method: 'POST',
    url: '/boss/course/saveOrUpdateCourse',
    data
  })
}

// 通过课程Id获取课程信息
export const getCourseById = courseId => {
  return request({
    method: 'GET',
    url: '/boss/course/getCourseById',
    params: {
      courseId
    }
  })
}

// 上传图片
export const upload = (data, onUploadProgress) => {
  return request({
    method: 'POST',
    url: '/boss/course/upload',
    data,
    // onUploadProgress用于检测上传进度
    onUploadProgress
  })
}
