<template>
  <div class="api-example">
    <div v-for="(e, i) in example" :key="'example-' + i">
      <pre v-highlightjs="e.code"><code :class="e.language"></code></pre>
    </div>
  </div>
</template>

<script lang="ts">
export { Example as default } from './Example';
</script>

<style lang="scss">
  .api-example {
  }
</style>
