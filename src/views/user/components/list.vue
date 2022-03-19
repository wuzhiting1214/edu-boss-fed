<template>
  <div class="user-list">
    <el-card>
      <div slot="header">
        <el-form
          :model="filterParams"
          :inline="true">
        <el-form-item label="手机号">
          <el-input
            v-model="filterParams.phone"
            prop="phone"
            placeholder="请输入手机号"
            clearable
            style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="注册时间" prop="rangeDate">
          <el-date-picker
            v-model="filterParams.rangeDate"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            value-format="yyyy-MM-dd"
            clearable
            >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleQuery">查询</el-button>
        </el-form-item>
      </el-form>
      </div>
      <div>
        <el-table
          v-loading="isLoading"
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="id"
            label="用户ID"
            width="180">
          </el-table-column>
          <el-table-column
            label="头像"
          >
            <el-avatar
              :size="30"
              :src="this.tableData.portrait || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'">
            </el-avatar>
          </el-table-column>
          <el-table-column
            prop="name"
            label="用户名"
            width="180">
          </el-table-column>
          <el-table-column
            prop="phone"
            label="手机号">
          </el-table-column>
          <el-table-column
            label="注册时间">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime | dateFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="状态">
            <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-value="ENABLE"
              inactive-value="DISABLE"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="handleLock(scope.row)"
            >
            </el-switch>
        </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="150">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleLock(scope.row)">禁用</el-button>
              <el-button
                type="text"
                @click="handleEdit(scope.row)">分配角色</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="filterParams.currentPage"
        :page-sizes="[10, 15, 20]"
        :page-size="filterParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        :disabled="isLoading"
      >
      </el-pagination>
      <el-dialog
        title="分配角色"
        :visible.sync="dialogVisible"
        width="30%">
        <el-select v-model="roleIdList" multiple placeholder="请选择">
          <el-option
            v-for="item in roles"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleOnSubmit">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
// 引入分页查询用户信息接口
import { getUserPages, forbidUser } from '@/services/user'
import { getAllRoles, allocateUserRoles, getUserRole } from '@/utils/role'
export default {
  name: 'UserList',
  data () {
    return {
      filterParams: {
        // 当前显示页数
        currentPage: 1,
        // 每页存储的数据条数
        pageSize: 10,
        phone: '',
        startCreateTime: '',
        endCreateTime: '',
        rangeDate: []
      },
      userId: null,
      roleIdList: [],
      roles: [],
      dialogVisible: false,
      totalCount: 0,
      isLoading: false,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      tableData: []
    }
  },
  created () {
    // 加载用户
    this.loadUserPages()
  },
  methods: {
    async handleOnSubmit () {
      const { data } = await allocateUserRoles({
        userId: this.userId,
        roleIdList: this.roleIdList
      })
      if (data.code === '000000') {
        this.$message.success('分配成功')
        this.dialogVisible = false
      }
    },
    async loadUserPages () {
      this.isLoading = true
      const { rangeDate } = this.filterParams
      if (rangeDate && rangeDate.length) {
        this.filterParams.startCreateTime = rangeDate[0]
        this.filterParams.endCreateTime = rangeDate[1]
      } else {
        this.filterParams.startCreateTime = ''
        this.filterParams.endCreateTime = ''
      }
      const { data } = await getUserPages(this.filterParams)
      if (data.code === '000000') {
        this.totalCount = data.data.total
        this.tableData = data.data.records
        this.isLoading = false
      }
    },
    async handleLock (tableData) {
      const { data } = await forbidUser(tableData.id)
      console.log(data)
    },
    async handleEdit (userInfo) {
      const { data } = await getAllRoles()
      this.roles = data.data
      this.dialogVisible = true
      this.userId = userInfo.id
      const { data: data2 } = await getUserRole(userInfo.id)
      if (data2.code === '000000') {
        this.roleIdList = data2.data.map(item => item.id)
      }
    },
    handleSizeChange (val) {
      this.filterParams.pageSize = val
      // 由于改变了每页的数据，所以将页数还原为默认值1
      this.filterParams.currentPage = 1
      this.loadUserPages()
    },
    handleCurrentChange (val) {
      this.filterParams.currentPage = val
      this.loadUserPages()
    },
    handleQuery () {
      this.filterParams.currentPage = 1
      this.loadUserPages()
      this.filterParams.phone = ''
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
