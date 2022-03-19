<template>
  <div class="create-or-edit">
    <el-form label-width="80px">
    <el-form-item label="资源名称">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="资源路径">
      <el-input v-model="form.url"></el-input>
    </el-form-item>
    <el-form-item label="资源分类">
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
    <el-form-item label="描述">
      <el-input type="textarea" v-model="form.description"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">确认</el-button>
      <el-button @click="onCancel">取消</el-button>
    </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { saveOrUpdate, getResourceCategories, getResource } from '@/utils/resource'
export default {
  name: 'CreateOrEdit',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    resourceId: {
      type: [String, Number]
    }
  },
  data () {
    return {
      form: {
        url: '',
        name: '',
        categoryId: '',
        description: ''
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
      const { data } = await getResource(this.resourceId)
      console.log(data)
      if (data.code === '000000') {
        this.form = data.data
      }
    },
    async loadResourceCategories () {
      const { data } = await getResourceCategories()
      console.log(data)
      if (data.code === '000000') {
        this.resourceCategories = data.data
      }
    },
    onCancel () {
      // 设置取消状态，让父组件处理
      this.$emit('cancel')
      this.form = {}
    },
    async onSubmit () {
      const { data } = await saveOrUpdate(this.form)
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
