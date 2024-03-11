<script setup lang="ts">
import {
  type PropType,
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  unref,
  watch,
} from 'vue';

import changeHtmlMapAdapter from '../../scripts/changeHtmlMapAdapter.mjs';

import CodeComponent from './CodeComponent.vue';
import SendToCodepen from './SendToCodepen.vue';

import type { TreeNode } from '../interfaces';

const props = defineProps({
  item: { type: Object as PropType<TreeNode>, required: true },
  fullScreen: Boolean,
});

const headerRef = ref<HTMLDivElement>();
const wrapperRef = ref<HTMLDivElement>();
const ngwMapAdapter = ref<string>(
  props.item.ngwMaps && props.item.ngwMaps[0] ? props.item.ngwMaps[0].name : '',
);

const radioOptions = computed(() => {
  return props.item.ngwMaps
    ? props.item.ngwMaps.map(({ name }) => ({ label: name, value: name }))
    : [];
});

const writeIFrame = async (html?: string) => {
  if (!html) {
    return;
  }
  await nextTick();
  const wrapper = wrapperRef.value;

  if (!wrapper) {
    console.error('Wrapper element not found');
    return;
  }

  wrapper.innerHTML = '';
  const iframe = document.createElement('iframe');

  iframe.setAttribute('width', '100%');
  iframe.setAttribute('height', '100%');

  iframe.srcdoc = html;

  wrapper.appendChild(iframe);
};

const html = ref<string>(props.item.html || '');
const iframeHtml = ref<string>(html.value);

const dirt = computed(() => html.value !== iframeHtml.value);

const changeAdapter = () => {
  const ngwMaps = unref(props.item.ngwMaps);
  const adapter = unref(ngwMapAdapter.value);
  if (ngwMaps) {
    const exist = ngwMaps.find((x) => x.name === adapter);
    if (exist) {
      html.value = changeHtmlMapAdapter(html.value, exist, ngwMaps);
      iframeHtml.value = html.value;
    }
  }
};

watch([ngwMapAdapter], changeAdapter);

watch(
  [iframeHtml],
  () => {
    writeIFrame(html.value);
  },
  { immediate: true },
);

const save = () => {
  iframeHtml.value = html.value;
};

const calculateHeight = (element: HTMLDivElement) => {
  let totalHeight = 0;
  const children = Array.from(element.children) as HTMLElement[];
  children.forEach((child) => {
    const style = window.getComputedStyle(child);
    const marginTop = parseInt(style.marginTop, 10);
    const marginBottom = parseInt(style.marginBottom, 10);
    totalHeight += child.offsetHeight + marginTop + marginBottom;
  });

  return totalHeight;
};

const scrollAreaHeight = ref('calc(100% - 90px)');
const updateScrollAreaHeight = () => {
  if (headerRef.value) {
    const headerHeight = calculateHeight(headerRef.value);
    scrollAreaHeight.value = `calc(100% - ${headerHeight}px)`;
  }
};

onMounted(() => {
  if (headerRef.value) {
    const resizeObserver = new ResizeObserver(updateScrollAreaHeight);
    resizeObserver.observe(headerRef.value);

    onUnmounted(() => {
      resizeObserver.disconnect();
    });
  }

  updateScrollAreaHeight();
});
</script>

<template>
  <div
    class="row q-pa-md"
    style="height: 100%; width: 100%; position: absolute"
  >
    <div class="col">
      <div ref="headerRef">
        <h2 class="title">
          {{ item.label }}
        </h2>
        <div class="text-subtitle1">{{ item.description }}</div>

        <div class="row wrap justify-between items-end content-start q-pb-sm">
          <div
            class="col"
            v-if="item.ngwMaps && item.ngwMaps.length"
          >
            <q-option-group
              v-model="ngwMapAdapter"
              :options="radioOptions"
              inline
            ></q-option-group>
          </div>
          <div
            class="col-auto q-pr-md"
            v-if="dirt"
          >
            <q-btn
              color="positive"
              icon-right="mdi-refresh"
              label="Update"
              outline
              dense
              @click="save"
            />
          </div>
        </div>
      </div>
      <q-scroll-area :style="{ width: '100%', height: scrollAreaHeight }">
        <SendToCodepen :item="item" />
        <CodeComponent v-model="html" />
      </q-scroll-area>
    </div>
    <div class="col">
      <div
        class="example-iframe"
        ref="wrapperRef"
      ></div>
    </div>
  </div>
</template>

<style>
.example-iframe {
  width: 100%;
  height: 100%;
}

.example-iframe iframe {
  width: 100%;
  height: 100%;
  border: 1px solid rgba(0, 0, 0, 0.3);
}
</style>
