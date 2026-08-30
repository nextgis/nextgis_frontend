<script setup lang="ts">
import CodeEditor from 'simple-code-editor/CodeEditor.vue';
import { useQuasar } from 'quasar';
import { computed } from 'vue';

const props = defineProps({
  modelValue: { type: String, required: true },
  fontSize: { type: String, default: '14px' },
});

const emit = defineEmits(['update:modelValue']);
const $q = useQuasar();

const theme = computed(() => ($q.dark.isActive ? 'github-dark' : 'github'));

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
    :languages="[['html', 'HTML']]"
    :font-size="fontSize"
    :theme="theme"
    width="100%"
  ></CodeEditor>
</template>
