<template>
  <div>
    <h3>{{item.kindString}} {{item.name}}</h3>

    <div v-for="p in item.children" :key="p.id">
      <div v-if="isItemAllow(p)">
      <p v-if="p.kindString === 'Property'">
        {{p.name}}
      </p>
      <p v-if="p.kindString === 'Method'">
        {{p.name}}(
          <span v-for="s in p.signatures" :key="s.id">
            <span v-for="p in s.parameters" :key="p.id">
              {{p.name}}
            </span>
          </span>
        )
      </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export { ClassItemComponent as default } from './ClassItem';
</script>

<style lang="scss">
</style>
