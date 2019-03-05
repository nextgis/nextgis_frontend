<template>
  <div>
    <div v-for="p in parameters" :key="p.id" class="pb-3">
      <h5 class="pb-1">{{p.name}}</h5>
      <property :item="p"></property>
    </div>
  </div>
</template>

<script lang="ts">
export { ApiParameters as default } from './ApiParameters';
</script>

<style lang="scss">
</style>
