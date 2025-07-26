<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';

const props = defineProps({
  html: { type: String, required: true },
});

const iframeRef = ref<HTMLIFrameElement>();
const content = computed(() => props.html);

const writeIFrame = async () => {
  if (!content.value) {
    return;
  }
  await nextTick();
  const iframe = iframeRef.value;

  if (!iframe) {
    console.error('Wrapper element not found');
    return;
  }

  const blob = new Blob([content.value], { type: 'text/html' });
  const blobUrl = URL.createObjectURL(blob);

  iframe.src = blobUrl;
};

watch([content], writeIFrame, { immediate: true });
</script>

<template>
  <iframe class="example-iframe" ref="iframeRef"></iframe>
</template>

<style>
.example-iframe {
  width: 100%;
  height: 100%;
  border: 1px solid rgba(0, 0, 0, 0.3);
}
</style>
