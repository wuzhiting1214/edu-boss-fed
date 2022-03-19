<template>
  <div class="course-section">
    <el-card>
      <el-tree
        v-loading="isLoading"
        :data="sections"
        :props="defaultProps"
        draggable
        :allow-drop="handleDrag"
        @node-drop="handleSave"
      >
        <div class="inner" slot-scope="{ node, data }">
          <!-- 内容设置 -->
          <span>{{ node.label }}</span>
          <!-- 按钮结构 -->
          <span v-if="data.sectionName" class="action">
            <el-button>编辑</el-button>
            <el-button>添加课时</el-button>
            <el-button>状态</el-button>
          </span>
          <span v-else class="action">
            <el-button>编辑</el-button>
            <el-button
              @click="$router.push({
                name: 'course-video',
                params: {
                  courseId
                  },
                query: {
                  lessonId: data.id
                }
              })">上传课时</el-button>
            <el-button>状态</el-button>
          </span>
        </div>
      </el-tree>
    </el-card>
  </div>
</template>

<script>
import { getSectionAndLesson, saveOrUpdateSection, saveOrUpdate } from '@/services/course-section'
export default {
  name: 'CourseSection',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  created () {
    this.loadSection()
  },
  data () {
    return {
      sections: [],
      defaultProps: {
        children: 'lessonDTOS',
        label (data) {
          return data.sectionName || data.theme
        }
      },
      isLoading: false
    }
  },
  methods: {
    // 节点拖拽后设置
    async handleSave (draggingNode, dropNode, type, event) {
      this.isLoading = true
      try {
        await Promise.all(dropNode.parent.childNodes.map((item, index) => {
          if (draggingNode.data.sectionId) {
            return saveOrUpdate({
              id: item.data.id,
              orderNum: index
            })
          } else {
            return saveOrUpdateSection({
              id: item.data.id,
              orderNum: index
            })
          }
        }))
        this.$message.success('数据更新成功')
      } catch (err) {
        this.$message.error('数据更新失败')
      }
      this.isLoading = false
    },
    // 节点拖拽时设置
    handleDrag (draggingNode, dropNode, type) {
      //  -规则1： 只能同级移动，type不能为 'inner'
      //  -规则2： 课时不能拖动到其他章节中 data.sectionId 必须相同
      if (type !== 'inner' && draggingNode.data.sectionId === dropNode.data.sectionId) {
        return true
      }
    },
    async loadSection () {
      const { data } = await getSectionAndLesson(this.courseId)
      if (data.code === '000000') {
        this.sections = data.data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .inner {
    display: flex;
    flex: 1;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #ebeef5;
  }
  ::v-deep .el-tree-node__content {
    height: auto;
  }
</style>
