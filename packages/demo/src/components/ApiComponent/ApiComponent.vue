<template>
  <v-container>
    <v-layout row wrap>
        <v-flex v-for="item in api.children" :key="item.name + item.id" xs4>
          <a @click="$root.goTo(item.name)">{{item.name}}</a>
        </v-flex>
    </v-layout>

    <div v-for="item in api.children" :key="item.id">
      <class-item :item="item"></class-item>
    </div>
  </v-container>
</template>

<script lang="ts">
export { ApiComponent as default } from './ApiComponent';
</script>

<style lang="scss">
</style>
