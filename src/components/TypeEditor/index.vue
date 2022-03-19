<template>
  <div ref="editor"></div>
</template>

<script>
// 引入图片上传接口
import { upload } from '@/services/course'
import E from 'wangeditor'
export default {
  name: 'TypeEditor',
  data () {
    return {
      // 用于编辑编辑的数据是否加载完毕
      isLoading: false,
      editor: null
    }
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  mounted () {
    // 富文本编辑器初始化
    this.initEditor()
  },
  methods: {
    initEditor () {
      const editor = new E(this.$refs.editor)
      // 创建富文本编辑器之前，进行事件设置
      editor.config.onchange = value => {
        this.$emit('input', value)
      }
      // 配置自定义上传图片功能
      editor.config.customUploadImg = async (resultFiles, insertImgFn) => {
        const fd = new FormData()
        fd.append('file', resultFiles[0])
        const { data } = await upload(fd)
        // console.log(data)
        if (data.code === '000000') {
          insertImgFn(data.data.name)
        }
      }
      // 创建富文本编辑器
      editor.create()
      editor.txt.html(this.value)
      this.editor = editor
    }
  },
  watch: {
    value () {
      if (!this.isLoading) {
        this.editor.txt.html(this.value)
        this.isLoading = true
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
