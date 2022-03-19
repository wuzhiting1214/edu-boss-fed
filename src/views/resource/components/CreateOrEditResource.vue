<template>
  <div class="create-or-edit">
    <el-form label-width="80px">
    <el-form-item label="资源名称">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="排序">
      <el-input v-model="form.sort"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">确认</el-button>
      <el-button @click="onCancel">取消</el-button>
    </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getResourceCategories, saveOrderUpdateCategory } from '@/utils/resource'
export default {
  name: 'CreateOrEditResource',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    categoryId: {
      type: [String, Number]
    }
  },
  data () {
    return {
      form: {
        name: '',
        sort: ''
      },
      resourceCategories: []
    }
  },
  created () {
    this.loadResourceCategories()
    if (this.isEdit) {
      this.loadRecourse()
    }
  },
  methods: {
    async loadRecourse () {
      const { data } = await getResourceCategories()
      console.log(this.categoryId)
      console.log(data)
      if (data.code === '000000') {
        this.form = data.data.filter(item => {
          return item.id === this.categoryId
        })[0]
        console.log(this.form)
      }
    },
    async loadResourceCategories () {
      const { data } = await getResourceCategories()
      if (data.code === '000000') {
        this.resourceCategories = data.data
      }
    },
    onCancel () {
      // 设置取消状态，让父组件处理
      this.$emit('cancel')
      this.role = {}
    },
    async onSubmit () {
      const { data } = await saveOrderUpdateCategory(this.form)
      if (data.code === '000000') {
        // 关闭提示框（需要子组件向父组件传递状态）
        this.$emit('success')
        // 设置成功提示
        this.$message.success('添加成功')
        // 清除表单内容
        this.form = {}
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
