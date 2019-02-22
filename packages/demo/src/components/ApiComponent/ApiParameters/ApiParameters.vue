<template>
  <div>
    <div v-if="item && item.signatures">
      <div v-for="s in item.signatures" :key="s.id">
        <div v-for="p in s.parameters" :key="p.id">
          <h5 class="pb-1 pt-3">{{p.name}}</h5>
          <api-option v-if="p.type.type === 'reference'" :id="p.type.id"></api-option>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export { ApiParameters as default } from './ApiParameters';
</script>

<style lang="scss">
</style>
