<template>
  <div class="app-header">
      <!-- 头部左侧组件 -->
       <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">home</el-breadcrumb-item>
            <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
            <el-breadcrumb-item>活动列表</el-breadcrumb-item>
            <el-breadcrumb-item>活动详情</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 头部右侧组件 -->
        <el-dropdown>
            <span class="el-dropdown-link">
                <el-avatar
                  :size="30"
                  :src="userInfo.portrait || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'">
                </el-avatar>
                <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>{{ userInfo.userName }}</el-dropdown-item>
                <el-dropdown-item
                  divided
                  @click.native="handleLogout"
                >退出</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
  </div>
</template>

<script>
import { getUserInfo } from '@/services/user'

export default {
  name: 'AppHeader',
  // 生命周期钩子不建议书写代码逻辑
  created () {
    // 加载用户信息
    this.loadUserInfo()
    // 模拟多次调用
    this.loadUserInfo()
  },
  data () {
    return {
      // 用户信息
      userInfo: {}
    }
  },
  methods: {
    async loadUserInfo () {
      const { data } = await getUserInfo()
      this.userInfo = data.content
    },
    // 退出功能
    handleLogout () {
      this.$confirm('是否退出?', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 1.删除store中的用户信息
        this.$store.commit('getUser', null)
        // 2.跳转到login页面
        this.$router.push('/login')
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-header {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .el-dropdown-link {
        display: flex;
        align-items: center;
    }
}
</style>
