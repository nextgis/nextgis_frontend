<template>
  <div>
    <h3>{{item.kindString}} {{item.name}}</h3>

    <div v-for="p in item.children" :key="p.id">

      <p v-if="p.kindString === 'Property'">
        {{p.kindString}} {{p.name}}
      </p>
      <p v-if="p.kindString === 'Method'">
        {{p.kindString}} {{p.name}}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
export { ClassItem as default } from './ClassItem';
</script>

<style lang="scss">
</style>
