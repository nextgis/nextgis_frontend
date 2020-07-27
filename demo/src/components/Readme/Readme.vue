<template>
  <div class="readme content ma-3" v-html="html"></div>
</template>

<script lang="ts">
export { Readme as default } from "./Readme";
</script>

<style>
.readme h1,
.readme h2,
.readme h3,
.readme h4,
.readme h5,
.readme h6 {
  margin: 1rem 0;
}
</style>
