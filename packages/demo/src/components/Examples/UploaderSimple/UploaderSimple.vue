<template>
  <div class="content">

    <h4 style="margin-bottom: 10px;">A simple example showing how to use `ngw-uploader.js` to upload a GEOTIFF to the NextgisWeb cloud.</h4>
    <p>Select GEOTIFF file (<a href="http://docs.nextgis.ru/docs_ngweb_dev/doc/developer/create.html#raster-preparing">how to prepare file</a>)</p>
    <div id='uploader'></div>
    <p id='status'></p>

    <h4 style="margin-top: 10px">Code</h4>
    <div>
      <pre v-highlightjs="sourcecode"><code class="html"></code></pre>
    </div>
  </div>
</template>

<script lang="ts">
export { UploaderSimple as default } from './UploaderSimple';
</script>

<style lang="scss">
  .content {
    margin: 30px;
  }
</style>
