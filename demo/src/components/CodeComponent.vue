<script setup lang="ts">
import 'highlight.js';
import CodeEditor from 'simple-code-editor/CodeEditor.vue';
import { computed } from 'vue';

const props = defineProps({
  modelValue: { type: String, required: true },
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
    font-size="14px"
    theme="github"
    width="100%"
  ></CodeEditor>
</template>
