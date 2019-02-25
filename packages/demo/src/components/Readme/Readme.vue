<template>
  <div class="readme content ma-3" v-html="item.html">
  </div>
</template>

<script lang="ts">
export { Readme as default } from './Readme';
</script>

<style lang="scss">
.readme {
  h1,h2,h3,h4,h5,h6 {
    margin: 1rem 0;
  }
}
</style>
