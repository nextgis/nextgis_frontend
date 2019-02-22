<template>
  <v-container>
    <div v-if="allowedChildren.length > 1">
      <h3>Content</h3>
      <v-layout row wrap>
        <v-flex class="go-to" v-for="item in allowedChildren" :key="item.name + item.id" xs12 sm6 md4>
          <a  @click="$root.goTo(item.name)">{{item.name}}</a>
        </v-flex>
      </v-layout>
    </div>
    <div v-for="item in allowedChildren" :key="item.id">
      <class-item :item="item"></class-item>
    </div>
  </v-container>
</template>

<script lang="ts">
export { ApiComponent as default } from "./ApiComponent";
</script>

<style lang="scss">
.go-to {
  overflow: ellipsis;
  white-space: nowrap;
}
</style>
