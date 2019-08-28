<template>
  <div>
    <div v-for="p in parameters" :key="p.id" class>
      <h4 class="pb-1">{{p.name}}</h4>
      <property :item="p"></property>
    </div>
  </div>
</template>

<script lang="ts">
export { ApiParameters as default } from "./ApiParameters";
</script>

<style>
</style>
