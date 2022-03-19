<template>
  <div class="course-edit">
    <create-or-edit
      isEdit
      :course-id="courseId"
    ></create-or-edit>
  </div>
</template>

<script>
import CreateOrEdit from './components/CreateOrEdit.vue'
export default {
  name: 'CourseEdit',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  components: {
    CreateOrEdit
  }
}
</script>

<style lang="scss" scoped></style>
