<template>
  <v-container>
    <div v-if="allowedChildren.length > 1">
      <h3>Content</h3>
      <v-layout row wrap class="pa-3">
        <v-flex
          class="go-to"
          v-for="item in allowedChildren"
          :key="item.name + item.id"
          xs12
          sm6
          md4
        >
          <a @click="$root.goTo(item.name)">{{item.name}}</a>
        </v-flex>
      </v-layout>
    </div>
    <div v-for="item in allowedChildren" :key="item.id">
      <h2 :id="item.name">
        <v-btn text icon small color @click="$root.goTo(item.name)">
          <v-icon>mdi-pound</v-icon>
        </v-btn>
        {{item.name}}
      </h2>
      <class-item :item="item" :showMembers="true"></class-item>
      <!-- <class-item :item="item" :showMembers="isMembersShowed(item.name)">
        <template v-if="!isMembersShowed(item.name)" v-slot:footer>
          <v-btn small primary @click="showItemMembers(item.name)">
            Show members
          </v-btn>
        </template>
      </class-item>-->
    </div>
  </v-container>
</template>

<script lang="ts">
export { ApiComponent as default } from "./ApiComponent";
</script>

<style>
.go-to {
  overflow: ellipsis;
  white-space: nowrap;
}
</style>
