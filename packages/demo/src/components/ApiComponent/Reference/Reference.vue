<template>
  <div>
    <div v-if="link">
      <span class="key-name">type:</span> <code><a @click.prevent="goTo">{{ parameter.type.name }}</a></code>
    </div>
    <api-option :id="parameter.type.id" v-if="!isNoApi()"></api-option>
  </div>
</template>

<script lang="ts">
export { Reference as default } from './Reference';
</script>

<style lang="scss">
</style>
