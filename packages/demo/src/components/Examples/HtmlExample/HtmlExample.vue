<template>
  <div class="content ma-3">
    <h3 class="title pb-3">{{ text }}</h3>
    <p>{{ description }}</p>

    <div class="example-iframe" id="example-iframe">

    </div>

    <div>
      <pre v-highlightjs="html"><code class="html"></code></pre>
    </div>
  </div>
</template>

<script lang="ts">
export { HtmlExample as default } from './HtmlExample';
</script>

<style lang="scss">

  .example-iframe {
    width: 100%;
    height: 300px;

  }
  .example-iframe iframe {
    width: 100%;
    height: 100%;
    border: 1px solid rgba(0,0,0,.3);
  }

</style>
