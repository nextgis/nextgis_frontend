<template>
  <div>
    <div v-for="s in utility.getSignaturesStr(item)" :key="s">
      <pre v-highlightjs="s"><code class="javascript"></code></pre>
    </div>

    <div v-if="item && item.signatures">
      <div v-for="s in item.signatures" :key="s.id">
        <div v-for="p in s.parameters" :key="p.id">
          <h5>{{p.name}}</h5>
          <api-option v-if="p.type.type === 'reference'" :id="p.type.id"></api-option>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export { ConstructorItemComponent as default } from "./ConstructorItem";
</script>

<style lang="scss">
</style>
