<template>
  <div>
    <comment :item="item"></comment>
    <div v-if="item.type && item.type.type === 'reference'">
      <reference :item="item"></reference>
    </div>
    <div v-else-if="optionType">
      <span class="key-name">type:</span>
      <code v-html="optionType"></code>
    </div>
    <div v-if="defaultValue">
      <span class="key-name">default:</span>
      <code v-html="defaultValue"></code>
    </div>
  </div>
</template>

<script lang="ts">
export { Property as default } from "./Property";
</script>

<style>
.key-name {
}
.key-name.to-return {
  font-weight: bold;
}
</style>
