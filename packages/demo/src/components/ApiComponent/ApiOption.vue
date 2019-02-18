<template>
  <div>
    <div v-for="item in api.children" :key="item.id">
      <div v-if="item.kindString === 'Class'">
        <class-item :item="item"></class-item>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export { ApiOption as default } from './ApiOption';
</script>

<style lang="scss">
</style>
