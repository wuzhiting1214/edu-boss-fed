<template>
  <el-container>
    <el-aside width="200px">
      <!-- 使用组件 侧边栏组件 -->
      <app-aside></app-aside>
    </el-aside>
    <el-container>
      <el-header>
        <!-- 头部组件 -->
        <app-header></app-header>
      </el-header>
      <el-main>
        <!-- 设置子路由出口 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AppAside from './components/AppAside'
import AppHeader from './components/AppHeader'

export default {
  name: 'Layout',
  components: {
    AppAside,
    AppHeader
  }
}
</script>

<style lang="scss" scoped>
  .el-container {
    height: 100vh;
    min-width: 980px;
  }

  .el-main {
    background-color: #e9eef3;
  }

  .el-header {
    background-color: #fff;
  }
</style>
