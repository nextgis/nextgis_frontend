<template>
  <div class="example-page-wrapper">
    <component
      v-if="current"
      v-bind:is="current.component"
      fullScrean="true"
      :text="current.name"
      :description="current.description"
      :html="current.html"
    ></component>
  </div>
</template>

<script lang="ts">
export { ExamplePage as default } from './ExamplePage';
</script>

<style lang="scss">
.example-page-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
