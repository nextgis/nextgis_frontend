<script setup lang="ts">
import { getHtmlSearchTags } from 'src/utils/searchTags';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import HtmlExampleComponent from 'components/HtmlExampleComponent.vue';
import LogoComponent from 'components/LogoComponent.vue';
import ReadmeComponent from 'components/ReadmeComponent.vue';

import type { Item, TreeNode } from '../interfaces';

const props = defineProps({
  id: String,
});

const { push } = useRouter();

const search = ref<string>('');
const drawer = ref(true);
const isLoading = ref(true);
const items = ref<TreeNode[]>([]);
const selected = ref<string | null>(null);
const expanded = ref<string[]>([]);

const currentPage = computed(() =>
  selected.value ? findItem(selected.value, items.value) : null,
);

const findItem = (id: string, _items: TreeNode[]): TreeNode | undefined => {
  for (let fry = 0; fry < _items.length; fry++) {
    const x = _items[fry];
    if (x.children) {
      const find = findItem(id, x.children);
      if (find) {
        return find;
      }
    }
    if (x.id === id) {
      return x;
    }
  }
};

const prepareItem = ({ name, ...conf }: Item) => {
  const item: TreeNode = { ...conf, label: name };
  if (conf.children) {
    item.model = true;
    item.children = conf.children.map((i) => prepareItem(i));
  }

  if (item.page === 'example') {
    item.icon = 'mdi-code-tags';
  } else if (item.page === 'readme') {
    item.icon = 'mdi-information-outline';
  }
  if (item.html) {
    item.tags = item.tags || [];
    item.tags.push(...getHtmlSearchTags(item.html));
  }

  return item;
};

const setSelected = (pageId?: string | null) => {
  if (pageId) {
    selected.value = pageId;
    push(`/${selected.value}`);
  }
};

const filterMethod = (node: TreeNode, filter: string): boolean => {
  const filt = filter.toLowerCase();

  const labelMatch = node.label && node.label.toLowerCase().includes(filt);
  const descriptionMatch =
    node.description && node.description.toLowerCase().includes(filt);

  const tagsMatch =
    node.tags && node.tags.some((tag) => tag.toLowerCase().includes(filt));

  return !!(labelMatch || descriptionMatch || tagsMatch);
};

const handleSelected = (newSelected: string) => {
  const node = items.value.find((item) => item.id === newSelected);

  if (node && node.children && node.children.length > 0) {
    const alreadyExpanded = expanded.value.includes(newSelected);

    if (alreadyExpanded) {
      expanded.value = expanded.value.filter((id) => id !== newSelected);
    } else {
      expanded.value = [...expanded.value, newSelected];
    }
    return null;
  }
  setSelected(newSelected);
};

const build = async () => {
  const examples = (await import('../examples.json')).default as ExampleItem[];
  isLoading.value = false;
  items.value = examples.map((x) => {
    return prepareItem(x);
  });

  if (props.id) {
    const pageFromProps = findItem(props.id, items.value);
    if (pageFromProps) {
      setSelected(pageFromProps.id);
    }
  }
  if (!selected.value) {
    const firstReadme = items.value.find((item) => item.page === 'readme');
    if (firstReadme) {
      setSelected(firstReadme.id);
    }
  }
};

onMounted(() => {
  build();
});
</script>

<template>
  <q-layout>
    <q-header elevated class="text-black header__container-1">
      <q-toolbar>
        <q-btn flat round dense @click="drawer = !drawer" aria-label="Menu">
          <q-icon name="mdi-menu" />
        </q-btn>
        <LogoComponent />
        <q-toolbar-title class="">Frontend</q-toolbar-title>

        <q-btn
          flat
          round
          dense
          icon="mdi-github"
          href="https://github.com/nextgis/nextgis_frontend"
          target="_blank"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-if="!isLoading" v-model="drawer" side="left">
      <q-input
        dense
        standout
        v-model="search"
        outlined
        style="height: 40px"
        class="q-ma-md"
        label="Search"
      >
        <template v-slot:append>
          <q-icon v-if="search === ''" name="search" />
          <q-icon
            v-else
            name="clear"
            class="cursor-pointer"
            @click="search = ''"
          />
        </template>
      </q-input>
      <q-scroll-area style="width: 100%; height: calc(100% - 72px)">
        <q-tree
          v-model:expanded="expanded"
          :nodes="items"
          :selected="selected"
          :filter="search"
          :filter-method="filterMethod"
          loading
          node-key="id"
          no-connectors
          @update:selected="handleSelected"
        >
        </q-tree>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <q-page>
        <q-circular-progress
          v-if="isLoading"
          indeterminate
          rounded
          size="50px"
          class="q-ma-md"
        />
        <q-scroll-area
          v-if="currentPage"
          :key="currentPage.id"
          style="width: 100%; height: 100%; position: absolute"
        >
          <ReadmeComponent
            v-if="currentPage.page === 'readme'"
            :item="currentPage"
          ></ReadmeComponent>
          <HtmlExampleComponent
            v-else-if="currentPage.page === 'example'"
            :item="currentPage"
          />
        </q-scroll-area>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style lang="scss">
.header__container-1 {
    background-color: #e5eef7;
    border-bottom: 1px solid #d3e3f2;
}
</style>
