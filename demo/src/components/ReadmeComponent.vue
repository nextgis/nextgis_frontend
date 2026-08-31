<template>
  <div ref="readmeRef" class="readme content q-ma-md" v-html="html"></div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { mdToHtml } from '../services/mdToHtml';

import type { TreeNode } from '../interfaces';
import type { PropType } from 'vue';

const props = defineProps({
  item: { type: Object as PropType<TreeNode>, required: true },
});

const route = useRoute();
const html = ref('');
const readmeRef = ref<HTMLElement>();

const scrollToHash = async () => {
  await nextTick();

  const root = readmeRef.value;
  if (!root) return;

  const id = decodeURIComponent(route.hash.slice(1));
  const target = id ? document.getElementById(id) : root;
  if (target && root.contains(target)) {
    target.scrollIntoView();
  }
};

onMounted(async () => {
  if (props.item.html) {
    html.value = props.item.html;
  } else if (props.item.md) {
    html.value = await mdToHtml(props.item.md);
  }

  await scrollToHash();
});

watch(() => route.hash, scrollToHash);
</script>

<style>
.readme {
  max-width: 1000px;
}

.readme h1,
.readme h2,
.readme h3,
.readme h4,
.readme h5,
.readme h6 {
  margin: 1rem 0;
}
</style>
