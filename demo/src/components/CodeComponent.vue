<script setup lang="ts">
import CodeEditor from 'simple-code-editor/CodeEditor.vue';
import { computed } from 'vue';

const props = defineProps({
  modelValue: { type: String, required: true },
  fontSize: { type: String, default: '14px' },
});

const emit = defineEmits(['update:modelValue']);

const html = computed({
  get() {
    return props.modelValue;
  },
  set(html: string) {
    emit('update:modelValue', html);
  },
});
</script>

<template>
  <CodeEditor
    v-model="html"
    line-nums
    :header="false"
    :font-size="fontSize"
    theme="github"
    width="100%"
  ></CodeEditor>
</template>
