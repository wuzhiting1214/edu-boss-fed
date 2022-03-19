import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入store
import store from '@/store'

// 引入路由中需要使用的组件功能(不高效)
// import Login from '@/views/login/index'
// import Advert from '@/views/advert/index'
// import Advertspace from '@/views/advert-space/index'
// import Course from '@/views/course/index'
// import ErrorPage from '@/views/error-page/index'
// import Home from '@/views/home/index'
// import Menu from '@/views/menu/index'
// import Resource from '@/views/resource/index'
// import Role from '@/views/role/index'
// import User from '@/views/user/index'
// import Layout from '@/views/layout/index'

// 路由懒加载 + chunk 指定名称 （高效）
const Login = () => import(/* webpackChunkName: 'login' */'@/views/login/index')
const Advert = () => import(/* webpackChunkName: 'guang' */'@/views/advert/index')
const AdvertSpace = () => import(/* webpackChunkName: 'aspace' */'@/views/advert-space/index')
const Course = () => import(/* webpackChunkName: 'course' */'@/views/course/index')
const ErrorPage = () => import(/* webpackChunkName: 'error-page' */'@/views/error-page/index')
const Home = () => import(/* webpackChunkName: 'home' */'@/views/home/index')
const Menu = () => import(/* webpackChunkName: 'menu' */'@/views/menu/index')
const Resource = () => import(/* webpackChunkName: 'resource' */'@/views/resource/index')
const Role = () => import(/* webpackChunkName: 'role' */'@/views/role/index')
const User = () => import(/* webpackChunkName: 'user' */'@/views/user/index')
const Layout = () => import(/* webpackChunkName: 'layout' */'@/views/layout/index')
// 添加菜单功能
const MenuCreate = () => import(/* webpackChunkName: 'menucreate' */'@/views/menu/create')
// 编辑菜单功能
const MenuEdit = () => import(/* webpackChunkName: 'menuedit' */'@/views/menu/edit')
// 分配菜单功能
const AllocMenu = () => import(/* webpackChunkName: 'allocmenu' */'@/views/role/alloc-menu')
// 新增课程功能
const CourseCreate = () => import(/* webpackChunkName: 'course-create' */'@/views/course/create')
// 编辑课程功能
const CourseEdit = () => import(/* webpackChunkName: 'course-edit' */'@/views/course/edit')
// 内容管理功能
const CourseSection = () => import(/* webpackChunkName: 'course-section' */'@/views/course/section')
// 上传视频功能
const CourseVideo = () => import(/* webpackChunkName: 'course-video' */'@/views/course/video')
// 分配资源功能
const AllocResource = () => import(/* webpackChunkName: 'alloc-resource' */'@/views/role/alloc-resource')
// 资源分类功能
const ResourceCategory = () => import(/* webpackChunkName: 'resource-category' */'@/views/resource/resource-category')

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '*',
    component: ErrorPage
  },
  {
    path: '/',
    component: Layout,
    // 直接给某个路由设置，这时内部的子路由都需要验证（包括本路由）
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'home',
        component: Home
      },
      {
        path: '/advert',
        name: 'advert',
        component: Advert
      },
      {
        path: '/advert-space',
        name: 'advert-space',
        component: AdvertSpace
      },
      {
        path: '/course',
        name: 'course',
        component: Course
      },
      {
        path: '/menu',
        name: 'menu',
        component: Menu
      },
      {
        path: '/resource',
        name: 'resource',
        component: Resource
      },
      {
        path: '/role',
        name: 'role',
        component: Role
      },
      {
        path: '/user',
        name: 'user',
        component: User
      },
      // 添加菜单路由
      {
        path: '/menu/create',
        name: 'menu-create',
        component: MenuCreate
      },
      // 编辑菜单路由
      {
        path: '/menu/:id/edit',
        name: 'menu-edit',
        component: MenuEdit
      },
      // 分配菜单路由
      {
        path: '/role/:roleId/alloc-menu',
        name: 'alloc-menu',
        component: AllocMenu,
        props: true
      },
      // 新增课程路由
      {
        path: '/course/create',
        name: 'course-create',
        component: CourseCreate
      },
      // 编辑课程路由
      {
        path: '/course/:courseId/create',
        name: 'course-edit',
        component: CourseEdit,
        props: true
      },
      // 内容管理路由
      {
        path: '/course/:courseId/section',
        name: 'course-section',
        component: CourseSection,
        props: true
      },
      // 视频上传路由
      {
        path: '/course/:courseId/video',
        name: 'course-video',
        component: CourseVideo,
        props: true
      },
      // 分配资源路由
      {
        path: '/resource/resource-category',
        name: 'resource-category',
        component: ResourceCategory
      },
      // 资源分类路由
      {
        path: '/role/:roleId/alloc-resource',
        name: 'alloc-resource',
        component: AllocResource,
        props: true
      }
    ]
  }
]
const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 验证store中的state中的user是否为空
    if (!store.state.user) {
      // 未登录，返回登录界面
      return next({
        name: 'login',
        query: {
          // 将本次路由的fullpath传递给login
          redirect: to.fullPath
        }
      })
    }
    // 已经登录，可以正常访问其他页面
    next()
  } else {
    next()
  }
})
export default router
