<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';

const props = defineProps({
  html: { type: String, required: true },
});

const PREVIEW_STORAGE_PREFIX = 'ngf-example-preview:';

const iframeRef = ref<HTMLIFrameElement>();
const content = computed(() => props.html);
const previewIdRef = ref<string>();

const getStorageKey = (previewId: string): string =>
  `${PREVIEW_STORAGE_PREFIX}${previewId}`;

const removeStoredPreview = (previewId?: string): void => {
  if (previewId) {
    sessionStorage.removeItem(getStorageKey(previewId));
  }
};

const createPreviewId = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const buildPreviewUrl = (previewId: string): string => {
  const url = new URL('example-preview.html', window.location.href);
  url.searchParams.set('previewId', previewId);
  url.searchParams.set('_', `${Date.now()}`);
  return url.toString();
};

const writeIFrame = async () => {
  await nextTick();
  const iframe = iframeRef.value;

  if (!iframe) {
    console.error('Wrapper element not found');
    return;
  }

  if (!content.value) {
    removeStoredPreview(previewIdRef.value);
    previewIdRef.value = undefined;
    iframe.removeAttribute('srcdoc');
    iframe.src = 'about:blank';
    return;
  }

  try {
    const previewId = createPreviewId();
    sessionStorage.setItem(getStorageKey(previewId), content.value);
    iframe.removeAttribute('srcdoc');
    iframe.src = buildPreviewUrl(previewId);

    removeStoredPreview(previewIdRef.value);
    previewIdRef.value = previewId;
  } catch (error) {
    console.error('Failed to initialize preview storage', error);
    removeStoredPreview(previewIdRef.value);
    previewIdRef.value = undefined;
    iframe.src = 'about:blank';
    iframe.srcdoc = content.value;
  }
};

onBeforeUnmount(() => {
  removeStoredPreview(previewIdRef.value);
});

watch(content, writeIFrame, { immediate: true });
</script>

<template>
  <iframe
    class="example-iframe"
    ref="iframeRef"
    referrerpolicy="strict-origin-when-cross-origin"
  ></iframe>
</template>

<style>
.example-iframe {
  display: block;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  height: 100%;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.3);
}
</style>
