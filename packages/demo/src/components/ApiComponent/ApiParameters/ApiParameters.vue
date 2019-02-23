<template>
  <div>
    <div v-for="p in parameters" :key="p.id">
      <h5 class="pb-1 pt-3">{{p.name}}</h5>
      <api-option v-if="p.type.type === 'reference'" :id="p.type.id"></api-option>

    </div>
  </div>
</template>

<script lang="ts">
export { ApiParameters as default } from './ApiParameters';
</script>

<style lang="scss">
</style>
