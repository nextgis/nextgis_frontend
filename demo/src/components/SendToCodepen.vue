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
});

const tabLeft = (text: string) => {
  const lines = text.split('\n');
  let newTextArr: string[] = [];
  const emptyCharsCounts = [];
  let noEmptyLinesOnBegin = false;
  for (let fry = 0; fry < lines.length; fry++) {
    let line = lines[fry];
    line = line.replace('\r', '');
    const isLineNotEmpty = !!line;
    if (noEmptyLinesOnBegin || isLineNotEmpty) {
      noEmptyLinesOnBegin = true;
      newTextArr.push(line);
      if (isLineNotEmpty) {
        const emptyLines = line.search(/\S/);
        if (emptyLines !== -1) {
          emptyCharsCounts.push(emptyLines);
        }
      }
    }
  }
  const minEmptyChars = Math.min(...emptyCharsCounts);
  if (minEmptyChars) {
    newTextArr = newTextArr.map((x) => x.substring(minEmptyChars));
  }
  return newTextArr.join('\n');
};

const parseHtml = (html: string): PenData => {
  const parseTag = (tag: string) => {
    const re = new RegExp(`<${tag}>((.|[\n\r])*)</${tag}>`, 'i');
    const match = html.match(re);
    if (match && match.length) {
      html = html.replace(match[0], '');
      return match[1] || '';
    }
    return '';
  };
  const js = tabLeft(parseTag('script'));
  const css = tabLeft(parseTag('style'));

  return {
    title: `${props.item.label} | ${props.item.id}`,
    description: '',
    html,
    html_pre_processor: 'none',
    css,
    css_pre_processor: 'none',
    css_starter: 'neither',
    css_prefix_free: false,
    js,
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
  if (props.item.html) {
    return JSON.stringify(parseHtml(props.item.html))
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
