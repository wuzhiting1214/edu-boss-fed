<template>
    <div class="menu-create-or-edit">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span
            style="cursor:pointer;"
            @click="$router.push({
              name: 'menu'
            })">返回 | </span>
          <span>{{ isEdit ? '编辑菜单' : '添加菜单'}}</span>
        </div>
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="菜单名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="菜单路径">
            <el-input v-model="form.href"></el-input>
          </el-form-item>
          <el-form-item label="上级菜单">
            <el-select v-model="form.parentId">
              <!-- 无上级菜单 -->
              <el-option
                label="无上级菜单"
                :value="-1"
              ></el-option>
              <!-- 选择一级菜单 -->
              <el-option
                v-for="item in parentMenuList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="form.description"></el-input>
          </el-form-item>
          <el-form-item label="前端图标">
            <el-input v-model="form.icon"></el-input>
          </el-form-item>
          <el-form-item label="是否显示">
            <el-radio-group v-model="form.shown">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="排序">
            <el-input-number v-model="form.orderNum" label="描述文字"></el-input-number>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">提交</el-button>
            <el-button v-if="!isEdit">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
</template>

<script>
import { getEditMenuInfo, createOrUpdateMenu } from '@/utils/menu'
export default {
  name: 'CreateOrEdit',
  // 通过props接收父组件传值，判断当前是编辑还是添加
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: {
        parentId: -1,
        name: '',
        href: '',
        icon: '',
        path: '',
        orderNum: 1,
        description: '',
        shown: true
      },
      parentMenuList: []
    }
  },
  created () {
    // 获取上级菜单信息
    this.loadMenuInfo()
  },
  methods: {
    async onSubmit () {
      const { data } = await createOrUpdateMenu(this.form)
      if (data.code === '000000') {
        this.$message.success('提交成功')
        this.$router.push({ name: 'menu' })
      }
    },
    async loadMenuInfo () {
      // 检测是否存在路由id，并进行对应处理
      const id = this.$route.params.id || -1
      const { data } = await getEditMenuInfo(id)
      if (data.code === '000000') {
        // 将上级菜单数据进行保存
        this.parentMenuList = data.data.parentMenuList
        // 检测是否存在菜单数据，如果存在，更新给form
        if (data.data.menuInfo) {
          this.form = data.data.menuInfo
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
