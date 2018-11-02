<template>
  <div class="content ma-3">
    <h3 class="title pb-3">{{ text }}</h3>
    <p>{{ description }}</p>

    <iframe class="example-iframe" id="example-iframe"></iframe>

    <div>
      <pre v-highlightjs="source"><code class="html"></code></pre>
    </div>
  </div>
</template>

<script lang="ts">
export { HtmlExample as default } from './HtmlExample';
</script>

<style lang="scss">

  .example-iframe {
    width: 100%;
    min-height: 300px;
    border: 1px solid rgba(0,0,0,.3);
  }

</style>
