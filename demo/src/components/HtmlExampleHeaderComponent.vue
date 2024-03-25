<script setup lang="ts">
import { type PropType, computed, onMounted, onUnmounted, ref } from 'vue';

import SendToCodepen from './SendToCodepen.vue';

import type { TreeNode } from '../interfaces';

const props = defineProps({
  modelValue: { type: String },
  scrollAreaHeight: { type: String },
  dirt: Boolean,
  item: { type: Object as PropType<TreeNode>, required: true },
});

const emit = defineEmits([
  'update:modelValue',
  'update:scrollAreaHeight',
  'save',
  'copy',
]);

const ngwMapAdapter = computed({
  get: () => props.modelValue || '',
  set: (val: string) => {
    emit('update:modelValue', val);
  },
});
const areaHeight = computed<string>({
  get: () => 'props.scrollAreaHeight',
  set: (val: string) => {
    emit('update:scrollAreaHeight', val);
  },
});

const headerRef = ref<HTMLDivElement>();

const radioOptions = computed(() => {
  return props.item.ngwMaps
    ? props.item.ngwMaps.map(({ name }) => ({ label: name, value: name }))
    : [];
});

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

const updateScrollAreaHeight = () => {
  if (headerRef.value) {
    const headerHeight = calculateHeight(headerRef.value);
    areaHeight.value = `calc(100% - ${headerHeight}px)`;
  }
};

onMounted(async () => {
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
  <div ref="headerRef">
    <h2 class="title">
      {{ item.label }}
    </h2>
    <div class="text-subtitle1">{{ item.description }}</div>

    <div class="row wrap q-pb-sm">
      <div class="col" v-if="item.ngwMaps && item.ngwMaps.length">
        <q-option-group
          v-model="ngwMapAdapter"
          :options="radioOptions"
          inline
        ></q-option-group>
      </div>
      <div class="col-auto q-pr-md">
        <div class="row">
          <q-btn
            class="col"
            padding="xs"
            v-if="dirt"
            color="positive"
            icon="mdi-refresh"
            flat
            round
            title="Update"
            @click="emit('save')"
          />
          <q-btn
            padding="xs"
            class="col"
            icon="mdi-content-copy"
            flat
            round
            title="Copy code"
            @click="() => emit('copy')"
          />
          <SendToCodepen class="col" :item="item" />
        </div>
      </div>
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
