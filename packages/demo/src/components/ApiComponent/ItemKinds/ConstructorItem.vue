<template>
  <div>
    <!-- {{item}} -->

    <div v-for="s in getSignaturesStr(item)" :key="s">
      {{s}}
    </div>

  </div>
</template>

<script lang="ts">
export { ConstructorItemComponent as default } from './ConstructorItem';
</script>

<style lang="scss">
</style>
