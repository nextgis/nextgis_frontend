<template>
  <div>

    <div v-if="item.type.type === 'reference'">
      <reference :parameter="item"></reference>
    </div>
    <div v-else>
       <span class="key-name">type:</span> <code>{{ getOptionType(item) }}</code>
    </div>
    <div v-if="defaultValue">
      <span class="key-name">default:</span> <code>{{ defaultValue }}</code>
    </div>

  </div>
</template>

<script lang="ts">
export { Property as default } from './Property';
</script>

<style lang="scss">
.key-name {

}
</style>
