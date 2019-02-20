<template>
  <div>
    <div v-for="s in utility.getSignaturesStr(item)" :key="s">
      <pre v-highlightjs="s"><code class="javascript"></code></pre>
    </div>

    <api-parameters :item="item"></api-parameters>

  </div>
</template>

<script lang="ts">
export { ConstructorItemComponent as default } from "./ConstructorItem";
</script>

<style lang="scss">
</style>
