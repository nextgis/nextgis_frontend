<template>
  <div>
    <div v-for="item in api.children" :key="item.id">
      <div v-if="item.kindString === 'Class'">
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
    </div>
  </div>
</template>

<script lang="ts">
export { ApiComponent as default } from './ApiComponent';
</script>

<style lang="scss">
</style>
