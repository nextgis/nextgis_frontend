<script setup lang="ts">
import { useQuasar } from 'quasar';
import { type PropType, computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

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
const route = useRoute();
const router = useRouter();
const ngwMaps = props.item.ngwMaps || [];

const ngwMapAdapter = computed<string>({
  get: () => {
    const adapter = route.query.adapter;
    return typeof adapter === 'string' &&
      ngwMaps.some((item) => item.name === adapter)
      ? adapter
      : ngwMaps[0]?.name || '';
  },
  set: (adapter) => {
    router.replace({
      query: { ...route.query, adapter },
    });
  },
});

const html = ref<string>(props.item.html || '');
const editableHtml = ref<string>(html.value);
const scrollAreaHeight = ref('calc(100% - 90px)');

const dirt = computed(() => html.value !== editableHtml.value);

const changeAdapter = () => {
  const adapter = ngwMapAdapter.value;
  const exist = ngwMaps.find((x) => x.name === adapter);
  if (exist) {
    html.value = changeHtmlMapAdapter(html.value, exist, ngwMaps);
    editableHtml.value = html.value;
  }
};

watch(ngwMapAdapter, changeAdapter, { immediate: true });

const save = () => {
  editableHtml.value = html.value;
};

const copy = async () => {
  try {
    await navigator.clipboard.writeText(editableHtml.value);
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
  <div
    v-if="$q.screen.lt.md"
    class="example-page q-pa-md"
    style="height: 100%; width: 100vw"
  >
    <HtmlExampleHeaderComponent
      v-model="ngwMapAdapter"
      v-model:scrollAreaHeight="scrollAreaHeight"
      :html="editableHtml"
      :item="item"
      :dirt="dirt"
      @save="save"
      @copy="save"
    />

    <HtmlExampleIframeComponent
      :html="editableHtml"
      style="height: 400px; width: 100%"
    />

    <CodeComponent v-model="html" class="example-code" fontSize="12px" />
  </div>
  <div
    v-else
    class="example-page row q-pa-md"
    style="height: 100%; width: 100%; position: absolute"
  >
    <div class="col">
      <HtmlExampleHeaderComponent
        v-model="ngwMapAdapter"
        v-model:scrollAreaHeight="scrollAreaHeight"
        :html="editableHtml"
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
      <HtmlExampleIframeComponent :html="editableHtml" />
    </div>
  </div>
</template>

<style>
.example-page {
  min-width: 0;
  max-width: 100%;
  overflow-x: hidden;
}

.example-page > .col,
.example-code {
  min-width: 0;
  max-width: 100%;
}

.example-code {
  width: 100%;
  overflow-x: auto;
}
</style>
