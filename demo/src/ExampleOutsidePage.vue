<template>
  <div class="example-page-wrapper">
    <component v-if="current" fullScreen="true" :is="current.component" :item="current"></component>
  </div>
</template>

<script lang="ts">
export { ExampleOutsidePage as default } from "./ExampleOutsidePage";
</script>

<style>
.example-page-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
