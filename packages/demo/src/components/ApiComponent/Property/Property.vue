<template>
  <div>

    <div v-if="item.type.type === 'reference'">
      <reference :parameter="item"></reference>
    </div>
    <div v-else>
      type: {{ getOptionType(item) }}
    </div>

  </div>
</template>

<script lang="ts">
export { Property as default } from './Property';
</script>

<style lang="scss">
</style>
