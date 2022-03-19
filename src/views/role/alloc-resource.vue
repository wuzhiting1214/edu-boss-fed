<template>
  <div>
    <el-card
      class="box-card"
      v-for="item in resourceList"
      :key="item.id"
    >
      <div
        slot="header"
        class="clearfix"
        >
        <span>{{item.name}}</span>
      </div>
      <div v-for="o in 4" :key="o" class="text item">
      {{'列表内容 ' + o }}
    </div>
    </el-card>
  </div>
</template>

<script>
/* eslint-disable */ 
import {
  getResource,
  getResourcePages,
  getResourceCategories,
  getAllResourceList,
  allocateRoleResources
} from '@/utils/resource'
export default {
  name: 'AllocResource',
  props: {
    roleId: {
      type: [Number, String],
      required: true
    }
  },
  created () {
    this.loadAllocResource()
    this.loadAllocResoureId()
    this.loadAllocResoureIdList()
  },
  data () {
    return {
      categoryId: [],
      resourceList: [],
      multipleSelection: []
    }
  },
  methods: {
    // 获取资源分类列表
    async loadAllocResoureId () {
      const { data } = await getResourceCategories()
      if (data.code === '000000') {
        this.resourceList = data.data
        for (let i = 0; i < this.resourceList.length; i++) {
        this.categoryId.push(this.resourceList[i].id)
        }
        console.log(this.categoryId)
      }
    },
    // 按照id查询资源
    async loadAllocResoureIdList () {
      const { data } = await getResourcePages({
        categoryId: this.categoryId[0],
        size: 20
      })
      console.log(data)
      console.log(this.categoryId)
      this.multipleSelection.push(data)
      console.log(this.multipleSelection)
    },
    // 获取所有资源
    async loadAllocResource () {
      const { data } = await getAllResourceList()
      // if (data.code === '000000') {
      //   this.resourceList = data.data
      // }
      // console.log(data)
    },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style lang="scss" scoped></style>
