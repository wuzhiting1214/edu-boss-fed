<template>
  <div class="role-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form :model="form" ref="form">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="角色名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="onReset">重置</el-button>
          <el-button type="primary" @click="onSubmit" v-loading="isLoading">查询</el-button>
        </el-form-item>
        </el-form>
      </div>
      <el-button @click="handleAdd">添加角色</el-button>
      <div>
        <el-table
          :data="roles"
          style="width: 100%"
          v-loading="isLoading"
        >
          <el-table-column
            prop="id"
            label="编号"
            width="100"
        >
          </el-table-column>
          <el-table-column
            prop="name"
            label="角色名称"
        >
          </el-table-column>
          <el-table-column
            prop="description"
            label="描述"
        >
          </el-table-column>
          <!-- 设置过滤器需要使用作用域插槽获取数据 -->
          <el-table-column
            label="添加时间">
            <template slot-scope="scope">
              <span>{{ scope.row.createdTime | dateFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="150">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="$router.push({
                  name: 'alloc-menu',
                  params: {
                    roleId: scope.row.id
                  }
                })"
              >分配菜单</el-button>
              <el-button
                type="text"
                @click="$router.push({
                  name: 'alloc-resource',
                  params: {
                    roleId: scope.row.id
                  }
                })"
              >分配资源</el-button>
              <el-button
                type="text"
                @click="handleEdit(scope.row)">编辑</el-button>
              <el-button
                type="text"
                @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog
          :title="isEdit ? '编辑角色' : '添加角色' "
          :visible.sync="dialogVisible"
          width="30%"
        >
        <!-- 引入添加角色对话框 -->
        <create-or-edit
          v-if="isShow"
          :is-edit="isEdit"
          :role-id="roleId"
          @success="handleSuccess"
          @cancel="handleCancel"
        ></create-or-edit>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getRolePages, deleteRole } from '@/utils/role'
import CreateOrEdit from './CreateOrEdit'

export default {
  name: 'RoleList',
  components: {
    CreateOrEdit
  },
  data () {
    return {
      form: {
        name: ''
      },
      roles: [],
      isLoading: false,
      dialogVisible: false,
      isEdit: false,
      roleId: '',
      isShow: false
    }
  },
  created () {
    this.loadRoles()
  },
  methods: {
    handleAdd () {
      this.dialogVisible = true
      this.isEdit = false
      this.isShow = true
    },
    handleCancel () {
      this.dialogVisible = false
      this.isShow = false
    },
    handleSuccess () {
      this.dialogVisible = false
      this.loadRoles()
      this.isShow = false
    },
    handleEdit (role) {
      this.dialogVisible = true
      this.isEdit = true
      this.roleId = role.id
      this.isShow = true
    },
    handleDelete (role) {
      this.$confirm(`确定删除角色： ${role.name}?`, '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data } = await deleteRole(role.id)
          if (data.code === '000000') {
            this.$message.success('删除成功!')
            this.loadRoles()
          }
        }).catch(err => {
          if (err && err.response) {
            this.$message.error('删除失败，请重试')
          } else {
            this.$message.info('已取消删除')
          }
        })
    },
    onReset () {
      this.$refs.form.resetFields()
    },
    onSubmit () {
      this.loadRoles()
    },
    async loadRoles () {
      this.isLoading = true
      const { data } = await getRolePages(this.form)
      this.roles = data.data.records
      this.isLoading = false
      this.form.name = ''
    }
  },
  filters: {
    // 日期过滤器
    dateFormat (date) {
      date = new Date(date)
      const m = date.getMonth() + 1
      const min = date.getSeconds()
      const s = date.getSeconds()
      // if (s < 10) {
      //   s = '0' + s
      // }
      return `
        ${date.getFullYear()}-${m > 10 ? m : '0' + m}-${date.getDate()}
        ${date.getHours()}:${min > 10 ? min : '0' + min}:${s > 10 ? s : '0' + s}
        `
    }
  }
}
</script>

<style lang="scss" scoped></style>
