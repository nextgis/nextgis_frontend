<template>
  <div>
    <div v-for="s in getSignaturesStr(item)" :key="s" >
      <h4 class="pb-3">Constructor</h4>
      <pre v-highlightjs="s"><code class="typescript"></code></pre>
    </div>

    <api-parameters :item="item"></api-parameters>

  </div>
</template>

<script lang="ts">
export { ConstructorItemComponent as default } from "./ConstructorItem";
</script>

<style lang="scss">
</style>
