<template>
  <div class="course-list">
    <el-card>
      <el-form ref="form" :model="form" :inline="true" label-width="100px">
        <el-form-item label="课程管理">
          <el-input v-model="form.courseName" placeholder="课程名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option label="上架" value="0"></el-option>
            <el-option label="下架" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="onSubmit" v-loading="isLoading">查询</el-button>
          <el-button type="primary" @click="$router.push({ name: 'course-create' })">+新建课程</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-table
        :data="courseList"
        style="width: 100%"
        v-loading="isLoading">
        <el-table-column
          prop="id"
          label="ID"
          width="60">
        </el-table-column>
        <el-table-column
          prop="courseName"
          label="课程名称"
          width="600">
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格"
          width="300">
        </el-table-column>
        <el-table-column
          prop="sortNum"
          label="排序"
          width="300">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="160">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              :disabled="scope.row.isStatusLoading"
              @change="onStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              @click="$router.push({
                name: 'course-edit',
                params: {
                  courseId: scope.row.id
                }
              })">编辑</el-button>
            <el-button
              @click="$router.push({
                name: 'course-section',
                params: {
                  courseId: scope.row.id
                }
              })">内容管理</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="form.currentPage"
        :page-sizes="[10,20,30,40]"
        :page-size="form.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getQueryCourses, changeState } from '@/services/course'
export default {
  name: 'CourseList',
  data () {
    return {
      form: {
        currentPage: 1,
        pageSize: 10,
        courseName: '',
        status: ''
      },
      totalCount: 0,
      courseList: [],
      isLoading: false
    }
  },
  created () {
    this.loadCourses()
  },
  methods: {
    async onStateChange (course) {
      course.isStatusLoading = true
      const { data } = await changeState({
        courseId: course.id,
        status: course.status
      })
      if (data.code === '000000') {
        this.$message.success(`${course.status === 1 ? '上架' : '下架'}成功`)
        course.isStatusLoading = false
      }
    },
    async loadCourses () {
      this.isLoading = true
      const { data } = await getQueryCourses(this.form)
      if (data.code === '000000') {
        data.data.records.forEach(element => {
          element.isStatusLoading = false
        })
        this.totalCount = data.data.total
        this.courseList = data.data.records
      }
      this.isLoading = false
    },
    onSubmit () {
      this.loadCourses()
    },
    handleSizeChange (val) {
      this.form.pageSize = val
      // 由于改变了每页的数据，所以将页数还原为默认值1
      this.form.currentPage = 1
      this.loadCourses()
    },
    handleCurrentChange (val) {
      this.form.currentPage = val
      this.loadCourses()
    }
  }
}
</script>

<style lang="scss" scoped></style>
