<template>
  <div v-if="example.length">
    <slot name="header"></slot>
    <div v-for="(e, i) in example" :key="'example-' + i" class="api-example">
      <pre v-highlightjs="e.code"><code :class="e.language"></code></pre>
    </div>
  </div>
</template>

<script lang="ts">
export { Example as default } from "./Example";
</script>

<style>
.api-example {
  padding: 0.7rem 0;
}
</style>
