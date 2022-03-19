<template>
  <div class="course-create">
    <el-card>
      <div slot="header">
      <el-steps :active="activeStep" simple>
        <el-step
          v-for="(item, i) in steps"
          :key="item.id"
          :title="item.title"
          :icon="item.icon"
          @click.native="activeStep = i"
        ></el-step>
      </el-steps>
      <el-form
        style="margin-top: 20px"
        label-width="80px"
        ref="form"
        :model="form"
        :rules="rules">
        <div v-show="activeStep === 0">
          <el-form-item label="名称" prop="courseName">
            <el-input
              v-model="form.courseName"
              clearable></el-input>
          </el-form-item>
          <el-form-item label="简介" prop="brief">
            <el-input v-model="form.brief" clearable></el-input>
          </el-form-item>
          <el-form-item label="讲师姓名">
            <el-input v-model="form.teacherDTO.teacherName" clearable></el-input>
          </el-form-item>
          <el-form-item label="职位">
            <el-input v-model="form.teacherDTO.position" clearable></el-input>
          </el-form-item>
          <el-form-item label="讲师简介">
            <el-input v-model="form.teacherDTO.description" clearable></el-input>
          </el-form-item>
          <el-form-item label="课程概述">
            <el-input
              v-model="form.previewFirstField"
              style="width: 49%;min-width: 300px;margin-right: 15px;"
              clearable
            >
              <template slot="append">{{ form.previewFirstField.length }}/20</template>
            </el-input>
            <el-input
              v-model="form.previewSecondField"
              style="width: 49%;min-width: 300px;"
              clearable
            >
              <template slot="append">{{ form.previewSecondField.length }}/20</template>
            </el-input>
          </el-form-item>
          <el-form-item label="课程排序">
            <el-input-number
              v-model="form.sortNum"
              controls-position="right"
              @change="handleChange"
              :min="1"></el-input-number>
          </el-form-item>
        </div>
        <div v-show="activeStep === 1">
          <!-- 上传课程封面图片组件 -->
          <course-image
            v-model="form.courseListImg"
            label="课程封面"
            :limit="3"
          ></course-image>
          <!-- 上传解锁图片组件 -->
          <course-image
            v-model="form.courseImgUrl"
            label="解锁封面"></course-image>
        </div>
        <div v-show="activeStep === 2">
          <el-form-item label="售卖价格">
            <el-input
              v-model="form.discounts"
              type="number"
              :min="0"
              clearable
              style="width: 300px">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="商品原价">
            <el-input
              v-model="form.price"
              type="number"
              :min="0"
              style="width: 300px"
              clearable>
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="销量">
            <el-input
              v-model="form.sales"
              type="number"
              :min="0"
              style="width: 300px" clearable>
              <template slot="append">单</template>
            </el-input>
          </el-form-item>
          <el-form-item label="活动标签">
            <el-input
              v-model="form.discountsTag"
              style="width: 300px" clearable></el-input>
          </el-form-item>
        </div>
        <div v-show="activeStep === 3">
          <el-form-item label="限时秒杀按钮" label-width="100px">
            <el-switch
              v-model="form.activityCourse"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
          <template v-if="form.activityCourse">
            <el-form-item label="开始时间">
              <el-date-picker
                v-model="form.activityCourseDTO.beginTime"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker
                v-model="form.activityCourseDTO.endTime"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="秒杀价">
              <el-input
                v-model="form.activityCourseDTO.amount"
                type="number"
                :min="0"
                clearable>
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="秒杀库存">
              <el-input
                v-model="form.activityCourseDTO.stock"
                type="number"
                :min="0"
                clearable>
                <template slot="append">个</template>
              </el-input>
            </el-form-item>
          </template>
        </div>
        <div v-show="activeStep === 4">
          <el-form-item>
            <!-- <el-input
              v-model="form.courseDescriptionMarkDown"
              typr="textarea"></el-input> -->
              <!-- <div ref="editor"></div> -->
              <!-- 富文本编辑器组件 -->
              <type-editor v-model="form.courseDescriptionMarkDown"></type-editor>
          </el-form-item>
          <el-form-item label="课程是否上架" label-width="100px">
            <el-switch
              v-model="form.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
          </el-form-item>
          <el-form-item>
            <el-button
              @click="handleSave"
              type="primary">保存</el-button>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button
            v-if="activeStep !== steps.length - 1"
            @click="activeStep++"
          >下一步</el-button>
        </el-form-item>
      </el-form>
    </div>
    </el-card>
  </div>
</template>

<script>
import CourseImage from './CourseImage.vue'
import { saveOrUpdateCourse, getCourseById } from '@/services/course'
// 引入富文本编辑器组件
import TypeEditor from '@/components/TypeEditor'

export default {
  components: {
    CourseImage,
    TypeEditor
  },
  name: 'CreateOrEdit',
  props: {
    isEdit: {
      type: Boolean,
      defalut: false
    },
    courseId: {
      type: [String, Number]
    }
  },
  data () {
    return {
      // 课程相关信息
      form: {
        // id: 0,
        // 课程名称
        courseName: '',
        // 课程简介
        brief: '',
        // 讲师信息
        teacherDTO: {
          // id: 0,
          // courseId: 0,
          teacherName: '',
          teacherHeadPicUrl: '',
          position: '',
          description: ''
        },
        // 课程详情内容
        courseDescriptionMarkDown: '<h3>默认值</h3>',
        // 商品原价
        price: 0,
        // 售卖价格
        discounts: 0,
        priceTag: '',
        // 活动标签
        discountsTag: '',
        isNew: true,
        isNewDes: '',
        // 课程封面
        courseListImg: '',
        // 解锁封面
        courseImgUrl: '',
        // 课程排序
        sortNum: 0,
        // 概述1
        previewFirstField: '',
        // 概述2
        previewSecondField: '',
        status: 0,
        // 销量
        sales: 0,
        // 参加秒杀的课程，默认值为false
        activityCourse: false,
        // 秒杀相关信息
        activityCourseDTO: {
          // id: 0,
          // courseId: 0,
          // 活动开始时间
          beginTime: '',
          // 活动结束时间
          endTime: '',
          // 秒杀价格
          amount: 0,
          // 秒杀库存
          stock: 0
        },
        autoOnlineTime: ''
      },
      rules: {
        courseName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        brief: [
          { required: true, message: '请输入简介', trigger: 'blur' }
        ]
      },
      activeStep: 0,
      steps: [
        {
          id: 1, title: '基本信息', icon: 'el-icon-edit'
        },
        {
          id: 2, title: '课程封面', icon: 'el-icon-upload'
        },
        {
          id: 3, title: '销售信息', icon: 'el-icon-picture'
        },
        {
          id: 4, title: '秒杀信息', icon: 'el-icon-picture'
        },
        {
          id: 5, title: '课程详情', icon: 'el-icon-picture'
        }
      ]
    }
  },
  created () {
    if (this.isEdit) {
      this.loadCourse()
    }
  },
  methods: {
    // 编辑功能根据课程id加载课程信息
    async loadCourse () {
      const { data } = await getCourseById(this.courseId)
      if (data.code === '000000') {
        if (!data.data.activityCourse) {
          data.data.activityCourseDTO = {
            beginTime: '',
            endTime: '',
            amount: 0,
            stock: 0
          }
        }
        this.form = data.data
      }
    },
    // 新增课程信息保存
    async handleSave () {
      const { data } = await saveOrUpdateCourse(this.form)
      if (data.code === '000000') {
        this.$message.success(`${this.isEdit ? '编辑' : '新增'}课程成功`)
        this.$router.push({ name: 'course' })
      }
    },
    handleChange (value) {
      console.log(value)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-step {
  cursor: pointer;
}
::v-deep .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
::v-deep .avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
