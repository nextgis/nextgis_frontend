<template>
  <div>
    <div v-for="item in api.children" :key="item.id">
      <div v-if="item.kindString === 'Class'">
        <class-item :api="item"></class-item>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export { ApiComponent as default } from './ApiComponent';
</script>

<style lang="scss">
</style>
