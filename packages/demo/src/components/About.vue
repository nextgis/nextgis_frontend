<template>
  <div class="my-app">
    <h1>{{title}}</h1>
    <p>{{info}}</p>
  </div>
</template>

<script lang="ts">
export { About as default } from "./About";
</script>

<style>
.my-app {
  text-align: center;
}
.my-app h1 {
  font-size: 24px;
  color: darkcyan;
}
.my-app p {
  font-size: 14px;
  color: grey;
}
</style>
