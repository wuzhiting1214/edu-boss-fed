<template>
  <el-card>
    <div slot="header">
      <span style="cursor: pointer" @click="$router.push({
        name: 'resource'
      })">返回 | </span>
      <span> 资源分类</span>
    </div>
    <div>
      <el-button @click="handleAdd">添加</el-button>
    </div>
    <div>
      <el-table
        :data="tableData"
        border
        style="width: 100%;">
        <el-table-column
          align="center"
          prop="id"
          label="编号"
          width="180"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="name"
          label="名称"
          width="400">
        </el-table-column>
        <!-- 设置过滤器需要使用作用域插槽获取数据 -->
        <el-table-column
          align="center"
          label="添加时间"
          width="500">
          <template slot-scope="scope">
            <span>{{ scope.row.createdTime | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="sort"
          label="排序">
        </el-table-column>
        <el-table-column
          align="center"
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
          :title="isEdit ? '编辑分类' : '添加分类' "
          :visible.sync="dialogVisible"
          width="30%"
      >
        <!-- 引入添加角色对话框 -->
        <create-or-edit-resource
          v-if="isShow"
          :is-edit="isEdit"
          :category-id="categoryId"
          @success="handleSuccess"
          @cancel="handleCancel"
        ></create-or-edit-resource>
      </el-dialog>
    </div>
  </el-card>
</template>

<script>
import CreateOrEditResource from './components/CreateOrEditResource.vue'
import { getResourceCategories, deleteResourceCategory } from '@/utils/resource'
export default {
  name: 'ResourceCategory',
  components: {
    CreateOrEditResource
  },
  data () {
    return {
      tableData: [],
      dialogVisible: false,
      isEdit: false,
      categoryId: '',
      isShow: false
    }
  },
  created () {
    this.loadResourceCategories()
  },
  methods: {
    async loadResourceCategories () {
      const { data } = await getResourceCategories()
      this.tableData = data.data
    },
    handleAdd () {
      this.dialogVisible = true
      this.isEdit = false
      this.isShow = true
    },
    handleEdit (category) {
      this.dialogVisible = true
      this.isEdit = true
      this.categoryId = category.id
      this.isShow = true
    },
    handleCancel () {
      this.dialogVisible = false
      this.isShow = false
    },
    handleSuccess () {
      this.dialogVisible = false
      this.loadResourceCategories()
      this.isShow = false
    },
    handleDelete (category) {
      this.$confirm(`确定删除角色： ${category.name}?`, '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data } = await deleteResourceCategory(category.id)
          if (data.code === '000000') {
            this.$message.success('删除成功!')
            this.loadResourceCategories()
          }
        }).catch(err => {
          if (err && err.response) {
            this.$message.error('删除失败，请重试')
          } else {
            this.$message.info('已取消删除')
          }
        })
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
