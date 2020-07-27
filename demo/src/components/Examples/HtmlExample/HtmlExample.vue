<template>
  <div v-if="fullScreen" class="example-iframe fullscrean" id="example-iframe"></div>
  <div v-else class="content ma-3">
    <h3 class="title pb-3">
      {{ item.name }}
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn text icon @click="openFullPage">
            <v-icon dark>mdi-fullscreen</v-icon>
          </v-btn>
        </template>
        <span>Open exampe in fullscrean</span>
      </v-tooltip>
    </h3>
    <p>{{ item.description }}</p>

    <div v-if="item.ngwMaps && item.ngwMaps.length">
      <v-radio-group v-model="ngwMap" row>
        <v-radio v-for="a in item.ngwMaps" :key="a.name" :label="a.name" :value="a.name"></v-radio>
      </v-radio-group>
    </div>

    <div class="example-iframe" id="example-iframe"></div>

    <div>
      <send-to-codepen :item="item"></send-to-codepen>
      <pre v-highlightjs="item.html"><code class="html"></code></pre>
    </div>
  </div>
</template>

<script lang="ts">
export { HtmlExample as default } from "./HtmlExample";
</script>

<style>
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
  border: 1px solid rgba(0, 0, 0, 0.3);
}
</style>
