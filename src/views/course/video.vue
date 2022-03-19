<template>
  <div class="course-video">
    <el-card>
      <div slot="header">
        课程相关信息
      </div>
      <el-form>
        <el-form-item label="上传视频">
          <input type="file" ref="video-file">
        </el-form-item>
        <el-form-item label="封面上传">
          <input type="file" ref="image-file">
        </el-form-item>
        <el-form-item>
          <el-button type='primary' @click="handleUpload">开始上传</el-button>
          <el-button @click="$router.push({
            name: 'course-section',
            params: {
              courseId
            }
          })">返回</el-button>
        </el-form-item>
        <el-form-item>
          <p v-if="uploadPercent !==0">视频上传中：{{ uploadPercent }}%</p>
          <p v-if="isTranscodeSuccess">视频转码中：{{ transCodePercent }}%</p>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {
  aliyunImageUploadAddressAndAuth,
  aliyunVideoUploadAddressAndAuth,
  aliyunTransCode,
  aliyunTransCodePercent
} from '@/services/aliyun-upload'

export default {
  name: 'CourseVider',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      uploader: null,
      imageUrl: '',
      videoId: null,
      // 视频转码进度
      transCodePercent: 0,
      // 视频上传进度
      uploadPercent: 0,
      isTranscodeSuccess: false
    }
  },
  created () {
    this.initUploader()
  },
  methods: {
    handleUpload () {
      this.isTranscodeSuccess = false
      this.uploadPercent = 0
      this.transCodePercent = 0
      const videoFile = this.$refs['video-file'].files[0]
      const imageFile = this.$refs['image-file'].files[0]
      const uploader = this.uploader
      // 将要上传的文件添加到上传列表中
      uploader.addFile(videoFile)
      uploader.addFile(imageFile)
      // 开始上传
      uploader.startUpload()
    },
    initUploader () {
      this.uploader = new window.AliyunUpload.Vod({
        // userID，必填，您可以使用阿里云账号访问账号中心（https://account.console.aliyun.com/），即可查看账号ID
        userId: '1618139964448548',
        // 上传到视频点播的地域，默认值为'cn-shanghai'，
        // eu-central-1，ap-southeast-1
        region: '',
        // 分片大小默认1 MB，不能小于100 KB（100*1024）
        partSize: 1048576,
        // 并行上传分片个数，默认5
        parallel: 5,
        // 网络原因失败时，重新上传次数，默认为3
        retryCount: 3,
        // 网络原因失败时，重新上传间隔时间，默认为2秒
        retryDuration: 2,
        // 开始上传
        onUploadstarted: async uploadInfo => {
          let uploadAddressAndAuth = null
          // 检测是否为图片
          if (uploadInfo.isImage) {
            // 图片处理
            const { data } = await aliyunImageUploadAddressAndAuth()
            if (data.code === '000000') {
              uploadAddressAndAuth = data.data
              this.imageUrl = uploadAddressAndAuth.imageURL
            }
          } else {
            // 视频处理
            const { data } = await aliyunVideoUploadAddressAndAuth({
              fileName: uploadInfo.file.name,
              imageUrl: this.imageUrl
            })
            if (data.code === '000000') {
              uploadAddressAndAuth = data.data
              this.videoId = data.data.videoId
            }
          }
          // 设置凭证与地址
          this.uploader.setUploadAuthAndAddress(
            uploadInfo,
            uploadAddressAndAuth.uploadAuth,
            uploadAddressAndAuth.uploadAddress,
            uploadAddressAndAuth.imageId || uploadAddressAndAuth.videoId
          )
          // 此步设置完成后上传进度开始执行
        },
        // 文件上传成功
        onUploadSucceed: function (uploadInfo) {
        },
        // 文件上传失败
        onUploadFailed: function (uploadInfo, code, message) {
        },
        // 文件上传进度，单位：字节
        onUploadProgress: (uploadInfo, totalSize, loadedPercent) => {
          if (!uploadInfo.isImage) {
            this.uploadPercent = Math.floor(loadedPercent * 100)
          }
        },
        // 上传凭证或STS token超时
        onUploadTokenExpired: function (uploadInfo) {
        },
        // 全部文件上传结束
        onUploadEnd: async uploadInfo => {
          // const lessonId = this.$route.query.lessonId
          // 发送转码请求
          const { data } = await aliyunTransCode({
            lessonId: this.$route.query.lessonId,
            coverImageUrl: this.imageUrl,
            fileId: this.videoId,
            fileName: this.$refs['video-file'].files[0].name
          })
          if (data.code === '000000') {
            // 轮询转码进度
            const timer = setInterval(async () => {
              const { data } = await aliyunTransCodePercent(this.$route.query.lessonId)
              if (data.code === '000000') {
                this.isTranscodeSuccess = true
                this.transCodePercent = data.data
                console.log(this.transCodePercent)
                if (data.data === 100) {
                  this.$message.success('视频转码成功')
                  clearInterval(timer)
                }
              }
            }, 1000)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
