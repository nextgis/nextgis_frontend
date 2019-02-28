<template>
  <div>
    <div v-for="p in parameters" :key="p.id" class="pb-3">
      <h5 class="pb-1">{{p.name}}</h5>

      <div v-if="p.type.type === 'reference'">
        <reference :parameter="p"></reference>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export { ApiParameters as default } from './ApiParameters';
</script>

<style lang="scss">
</style>
