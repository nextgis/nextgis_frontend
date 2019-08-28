<template>
  <div v-if="constructorItem">
    <div v-for="s in constructorItem.signatures" :key="'signature-comment-' + s.id">
      <comment :item="s"></comment>
    </div>

    <div v-for="s in getSignaturesStr(constructorItem)" :key="s">
      <div v-if="constructorItem.kindString === 'Constructor'" class="pb-2">
        <h4 class="pb-2">Constructor</h4>
        <pre v-highlightjs="s"><code class="typescript"></code></pre>
      </div>
    </div>
    <api-parameters :item="constructorItem"></api-parameters>
  </div>
</template>

<script lang="ts">
export { ConstructorItemComponent as default } from "./ConstructorItem";
</script>

<style>
</style>
