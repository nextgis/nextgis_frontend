<script setup lang="ts">
import { useQuasar } from 'quasar';
import { type PropType, computed, ref, unref, watch } from 'vue';

import changeHtmlMapAdapter from '../../scripts/changeHtmlMapAdapter.mjs';

import CodeComponent from './CodeComponent.vue';
import HtmlExampleHeaderComponent from './HtmlExampleHeaderComponent.vue';
import HtmlExampleIframeComponent from './HtmlExampleIframeComponent.vue';

import type { TreeNode } from '../interfaces';

const props = defineProps({
  item: { type: Object as PropType<TreeNode>, required: true },
  fullScreen: Boolean,
});
const $q = useQuasar();

const ngwMapAdapter = ref<string>(
  props.item.ngwMaps && props.item.ngwMaps[0] ? props.item.ngwMaps[0].name : '',
);

const html = ref<string>(props.item.html || '');
const iframeHtml = ref<string>(html.value);
const scrollAreaHeight = ref('calc(100% - 90px)');

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

const save = () => {
  iframeHtml.value = html.value;
};

const copy = async () => {
  try {
    await navigator.clipboard.writeText(iframeHtml.value);
    $q.notify({
      color: 'positive',
      position: 'top',
      message: 'Text copied successfully',
      timeout: 3000,
    });
  } catch (err) {
    $q.notify({
      color: 'negative',
      position: 'top',
      message: 'Error copying text',
      timeout: 3000,
    });
  }
};
</script>

<template>
  <div v-if="$q.screen.lt.md" class="q-pa-md" style="height: 100%; width: 100%">
    <HtmlExampleHeaderComponent
      v-model="ngwMapAdapter"
      v-model:scrollAreaHeight="scrollAreaHeight"
      :html="iframeHtml"
      :item="item"
      :dirt="dirt"
      @save="save"
      @copy="save"
    />

    <HtmlExampleIframeComponent
      :html="iframeHtml"
      style="height: 400px; width: 100%"
    />

    <CodeComponent v-model="html" style="overflow-x: auto" fontSize="12px" />
  </div>
  <div
    v-else
    class="row q-pa-md"
    style="height: 100%; width: 100%; position: absolute"
  >
    <div class="col">
      <HtmlExampleHeaderComponent
        v-model="ngwMapAdapter"
        v-model:scrollAreaHeight="scrollAreaHeight"
        :html="iframeHtml"
        :item="item"
        :dirt="dirt"
        @save="save"
        @copy="copy"
      />

      <q-scroll-area :style="{ width: '100%', height: scrollAreaHeight }">
        <CodeComponent v-model="html" />
      </q-scroll-area>
    </div>
    <div class="col">
      <HtmlExampleIframeComponent :html="iframeHtml" />
    </div>
  </div>
</template>

<style>
.example-iframe {
  width: 100%;
  height: 100%;
  border: 1px solid rgba(0, 0, 0, 0.3);
}
</style>
