<template>
  <div class="resource-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form
          :inline="true"
          :model="form"
          class="demo-form-inline"
          ref="form"
        >
          <el-form-item label="资源名称" prop="name">
            <el-input
              v-model="form.name"
              placeholder="资源名称"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="资源路径" prop="url">
            <el-input
              v-model="form.url"
              placeholder="资源路径"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="资源分类" prop="categoryId">
            <el-select
              v-model="form.categoryId"
              placeholder="资源分类"
              clearable
            >
            <el-option
              v-for="item in resourceCategories"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onReset">重置</el-button>
            <el-button type="primary" @click="onSubmit" :disabled="isLoading">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-button @click="handleAdd">添加</el-button>
        <el-button @click="$router.push({
          name: 'resource-category'
        })">资源分类</el-button>
      </div>
      <div>
        <el-table
          :data="resources"
          style="width: 100%"
          v-loading="isLoading"
        >
          <el-table-column
            label="编号"
            type="index"
            width="100">
          </el-table-column>
          <el-table-column
            prop="name"
            label="资源名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="url"
            label="资源路径">
          </el-table-column>
          <el-table-column
            prop="description"
            label="描述">
          </el-table-column>
          <!-- 设置过滤器需要使用作用域插槽获取数据 -->
          <el-table-column
            label="添加时间">
            <template slot-scope="scope">
              <span>{{ scope.row.createdTime | dateFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        </el-table>
        <el-dialog
          :title="isEdit ? '编辑资源' : '添加资源' "
          :visible.sync="dialogVisible"
          width="30%"
        >
        <!-- 引入添加角色对话框 -->
        <create-or-edit
          v-if="isShow"
          :is-edit="isEdit"
          :resource-id="resourceId"
          @success="handleSuccess"
          @cancel="handleCancel"
        ></create-or-edit>
        </el-dialog>
      </div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="form.current"
        :page-sizes="[10, 15, 20]"
        :page-size="form.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        :disabled="isLoading"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import CreateOrEdit from './CreateOrEdit'
import { getResourcePages, getResourceCategories, deleteResource } from '@/utils/resource'

export default {
  name: 'ResourceList',
  components: {
    CreateOrEdit
  },
  data () {
    return {
      form: {
        // 当前显示页数
        current: 1,
        // 每页存储的数据条数
        size: 10,
        name: '',
        catergoryId: '',
        url: ''
      },
      totalCount: 0,
      resources: [],
      resourceId: '',
      resourceCategories: [],
      isLoading: false,
      dialogVisible: false,
      isEdit: false,
      isShow: false
    }
  },
  created () {
    this.loadResources()
    this.loadResourceCategories()
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
      this.loadResources()
      this.isShow = false
    },
    handleEdit (resource) {
      this.dialogVisible = true
      this.isEdit = true
      this.resourceId = resource.id
      this.isShow = true
    },
    handleDelete (resource) {
      this.$confirm(`确定删除角色： ${resource.name}?`, '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data } = await deleteResource(resource.id)
          if (data.code === '000000') {
            this.$message.success('删除成功!')
            this.loadResources()
          }
        }).catch(err => {
          if (err && err.response) {
            this.$message.error('删除失败，请重试')
          } else {
            this.$message.info('已取消删除')
          }
        })
    },
    async loadResourceCategories () {
      const { data } = await getResourceCategories()
      console.log(data)
      if (data.code === '000000') {
        this.resourceCategories = data.data
      }
    },
    async loadResources () {
      this.isLoading = true
      const { data } = await getResourcePages(this.form)
      if (data.code === '000000') {
        this.resources = data.data.records
        this.totalCount = data.data.total
        this.isLoading = false
        this.form = {}
      }
    },
    onSubmit () {
      this.form.current = 1
      this.loadResources()
    },
    onReset () {
      this.$refs.form.resetFields()
    },
    handleSizeChange (val) {
      this.form.size = val
      // 由于改变了每页的数据，所以将页数还原为默认值1
      this.form.current = 1
      this.loadResources()
    },
    handleCurrentChange (val) {
      this.form.current = val
      this.loadResources()
    }
  },
  filters: {
    // 日期过滤器
    dateFormat (date) {
      date = new Date(date)
      const h = date.getHours()
      const m = date.getMonth() + 1
      const min = date.getSeconds()
      const s = date.getSeconds()
      // if (s < 10) {
      //   s = '0' + s
      // }
      return `
        ${date.getFullYear()}-${m > 10 ? m : '0' + m}-${date.getDate()}
        ${h > 10 ? h : '0' + h}:${min > 10 ? min : '0' + min}:${s > 10 ? s : '0' + s}
        `
    }
  }
}
</script>

<style lang="scss" scoped></style>
