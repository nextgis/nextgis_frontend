<template>
  <div class="my-app">
   <h1>{{title}}</h1>
   <p>{{info}}</p>
  </div>
</template>

<script lang="ts">
export { About as default } from './About';
</script>

<style lang="scss">
.my-app {
  text-align: center;
  h1 {
    font-size: 24px;
    color: darkcyan;
  }
  p {
    font-size: 14px;
    color: grey;
  }
}
</style>
