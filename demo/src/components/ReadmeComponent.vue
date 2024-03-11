<template>
  <div class="readme content q-ma-md" v-html="html"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { mdToHtml } from '../services/mdToHtml';

import type { TreeNode } from '../interfaces';
import type { PropType } from 'vue';

const props = defineProps({
  item: { type: Object as PropType<TreeNode>, required: true }
});

const html = ref('');

onMounted(async () => {
  if (props.item.html) {
    html.value = props.item.html;
  } else if (props.item.md) {
    html.value = await mdToHtml(props.item.md);
  }

  window.scrollTo(0, 0);
});
</script>

<style>
.readme h1,
.readme h2,
.readme h3,
.readme h4,
.readme h5,
.readme h6 {
  margin: 1rem 0;
}
</style>
