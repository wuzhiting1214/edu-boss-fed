<template>
  <div class="alloc-menu">
    <el-card>
      <span
        style="cursor:pointer;"
        @click="$router.push({
          name: 'role'
        })">返回
      </span>
    </el-card>
    <el-card>
      <el-tree
        ref="menu-tree"
         node-key="id"
        :data="menus"
        :props="defaultProps"
        :default-checked-keys="checkedKeys"
        default-expand-all
        show-checkbox
      >
      </el-tree>
      <div style="margin: 20px;" align="center">
        <el-button
          type="primary"
          @click="onSave"
        >保存</el-button>
        <el-button @click="onClear">清空</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getMenuNodeList, allocateRoleMenus, getRoleMenus } from '@/utils/menu'
export default {
  name: 'AllocMenu',
  props: {
    roleId: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      menus: [],
      defaultProps: {
        children: 'subMenuList',
        label: 'name'
      },
      checkedKeys: []
    }
  },
  created () {
    // 获取menu-tree展示的内容
    this.loadMenuList()
    // 获取角色分配的菜单
    this.loadRoleMenu()
  },
  methods: {
    onClear () {
      this.$refs['menu-tree'].setCheckedKeys([])
    },
    // 自己封装的用于数据筛选的方法
    getCheckedKeys (menus) {
      menus.forEach(menu => {
        if (!menu.selected) {
          return
        }
        if (menu.subMenuList) {
          return this.getCheckedKeys(menu.subMenuList)
        }
        this.checkedKeys = [...this.checkedKeys, menu.id]
      })
    },
    async loadRoleMenu () {
      const { data } = await getRoleMenus(this.roleId)
      if (data.code === '000000') {
        this.getCheckedKeys(data.data)
      }
    },
    async onSave () {
      const { data } = await allocateRoleMenus({
        roleId: this.roleId,
        menuIdList: this.$refs['menu-tree'].getCheckedKeys()
      })
      if (data.code === '000000') {
        this.$message.success('分配角色菜单成功')
        this.$router.push({
          name: 'role'
        })
      }
    },
    async loadMenuList () {
      const { data } = await getMenuNodeList()
      if (data.code === '000000') {
        this.menus = data.data
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
