<template>
  <div v-if="fullScrean" class="example-iframe fullscrean" id="example-iframe">
  </div>
  <div v-else class="content ma-3">
    <h3 class="title pb-3">
      {{ text }}
      <v-tooltip bottom>
        <v-btn
          slot="activator"
          flat
          icon
          @click="openFullPage"
        >
          <v-icon dark>mdi-fullscreen</v-icon>
        </v-btn>
        <span>Open exampe in fullscrean</span>
      </v-tooltip>

    </h3>
    <p>{{ description }}</p>

    <div class="example-iframe" id="example-iframe"></div>

    <div>
      <send-to-codepen :html="html"></send-to-codepen>
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
    height: 400px;
  }
  .example-iframe.fullscrean {
    height: 100%;
  }


  .example-iframe iframe {
    width: 100%;
    height: 100%;
    border: 1px solid rgba(0,0,0,.3);
  }

</style>
