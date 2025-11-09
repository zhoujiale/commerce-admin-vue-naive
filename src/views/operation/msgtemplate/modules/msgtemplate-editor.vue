<script setup lang="tsx">
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { onBeforeUnmount, ref, shallowRef, onMounted, watch } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
defineOptions({
  name: 'MsgtemplatEditor'
});

const emit = defineEmits<{
  (e: 'updateContent', content: string): void
}>();
const props = defineProps<{
  content?: string
}>()
const mode = 'default'
const editorRef = shallowRef()
const valueHtml = ref(props.content || '');
const toolbarConfig = {}
const editorConfig = { placeholder: '请输入内容...' }

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor: any) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}

defineExpose({
  getContent: () => valueHtml.value
})

watch(
  () => props.content,
  (newContent) => {
    console.log('newContent', newContent)
    if(newContent !== undefined) {
      valueHtml.value = newContent
    }
  },
  { immediate: true }
)

</script>
<template>
  <div style="border: 1px solid #ccc">
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
      />
      <Editor
        style="height: 500px; overflow-y: hidden;"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated"
      />
    </div>
</template>