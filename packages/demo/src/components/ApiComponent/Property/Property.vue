<template>
  <div>
    <comment :item="item"></comment>
    <div v-if="item.type.type === 'reference'">
      <reference :parameter="item"></reference>
    </div>
    <div v-else>
       <span class="key-name">type:</span> <code v-html="getOptionType(item)"></code>
    </div>
    <div v-if="defaultValue">
      <span class="key-name">default:</span> <code v-html="defaultValue"></code>
    </div>

  </div>
</template>

<script lang="ts">
export { Property as default } from './Property';
</script>

<style lang="scss">
.key-name {

}
.key-name.to-return {
  font-weight: bold;
}
</style>
