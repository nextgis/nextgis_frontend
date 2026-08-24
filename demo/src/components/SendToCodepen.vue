<script setup lang="ts">
import { computed } from 'vue';

import type { TreeNode } from '../interfaces';
import type { PropType } from 'vue';

interface PenData {
  html?: string;
  css?: string;
  js?: string;
  title?: string;
  description?: string;
  editors?: string;
  html_pre_processor?: 'none';
  css_pre_processor?: 'none';
  css_starter?: 'neither';
  css_prefix_free?: boolean;
  js_pre_processor?: 'none';
  js_modernizr?: boolean;
  js_library?: string;
  html_classes?: string;
  css_external?: string;
  js_external?: string;
  template?: boolean;
}

const props = defineProps({
  item: { type: Object as PropType<TreeNode>, required: true },
  html: { type: String, required: true },
});

const parseHtml = (html: string): PenData => {
  return {
    title: `${props.item.label} | ${props.item.id}`,
    description: '',
    editors: '100',
    html,
    html_pre_processor: 'none',
    css: '',
    css_pre_processor: 'none',
    css_starter: 'neither',
    css_prefix_free: false,
    js: '',
    js_pre_processor: 'none',
    js_modernizr: false,
    js_library: '',
    html_classes: '',
    css_external: '',
    js_external: '',
    template: true,
  };
};

const value = computed(() => {
  if (props.html) {
    return JSON.stringify(parseHtml(props.html))
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
  return '';
});
</script>

<template>
  <form action="https://codepen.io/pen/define" method="POST" target="_blank">
    <input type="hidden" name="data" :value="value" />
    <q-btn
      type="submit"
      flat
      round
      icon="mdi-codepen"
      title="Edit in Codepen"
    />
  </form>
</template>

<style></style>
