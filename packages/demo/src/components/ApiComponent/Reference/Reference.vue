<template>
  <div>
    <div v-if="link">
      type: <a @click.prevent="goTo">{{ parameter.type.name }}</a>
    </div>
    <api-option :id="parameter.type.id" v-if="!isNoApi()"></api-option>
  </div>
</template>

<script lang="ts">
export { Reference as default } from './Reference';
</script>

<style lang="scss">
</style>
