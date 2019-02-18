<template>
  <div>
    <!-- {{item}} -->

    <div v-for="s in utility.getSignaturesStr(item)" :key="s">
      <pre><code class="javascript">{{s}}</code></pre>
    </div>

  </div>
</template>

<script lang="ts">
export { ConstructorItemComponent as default } from './ConstructorItem';
</script>

<style lang="scss">
</style>
