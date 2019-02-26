<template>
  <div>
    <!-- <router-link v-if="link" :to="link">{{ parameter.type.name }}</router-link> -->
    <div v-if="link">
      Detailed: <a @click="goTo">{{ parameter.type.name }}</a>
    </div>
    <api-option :id="parameter.type.id"></api-option>
  </div>
</template>

<script lang="ts">
export { Reference as default } from "./Reference";
</script>

<style lang="scss">
</style>
