<template>
  <div class="course-image">
    <el-form-item :label="label">
      <!-- 进度条组件 -->
      <el-progress
        v-if="isUploading"
        type="circle"
        :percentage="percentage"
        :status="percentage === 100 ? 'success' : undefined "
      ></el-progress>
      <!-- 图片上传组件 -->
      <el-upload
        v-else
        class="avatar-uploader"
        action="https://jsonplaceholder.typicode.com/posts/"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :http-request="handleUpload"
      >
        <img v-if="value" :src="value" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-form-item>
  </div>
</template>

<script>
import { upload } from '@/services/course'
export default {
  name: 'CourseImage',
  data () {
    return {
      isUploading: false,
      percentage: 0
    }
  },
  props: {
    value: {
      type: String
    },
    label: {
      type: String
    },
    limit: {
      type: Number,
      dafault: 2
    }
  },
  methods: {
    // 上传图片功能
    //  -option为上传的相关信息
    //   -option.file为上传的文件信息
    async handleUpload (option) {
      this.isUploading = true
      const fd = new FormData()
      fd.append('file', option.file)
      const { data } = await upload(fd, event => {
        this.percentage = Math.floor(event.loaded / event.total * 100)
      })
      if (data.code === '000000') {
        this.$emit('input', data.data.name)
        this.isUploading = false
        this.percentage = 0
      }
    },
    handleChange (value) {
      console.log(value)
    },
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style lang="scss" scoped>
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
