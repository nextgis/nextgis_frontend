<template>
  <v-app id="inspire">

    <v-navigation-drawer
      :clipped="$vuetify.breakpoint.lgAndUp"
      :open="open"
      v-model="drawer"
      fixed
      app
    >
      <v-treeview
        v-if="items"
        :active.sync="active"
        :items="items"
        :open="open"
        dark
        style="background:#0070c5"
        activatable
        open-on-click
        transition
        @update:open="onOpen"
      >
        <template slot="prepend" slot-scope="{ item, open, leaf }">
          <v-icon v-if="item.icon">{{item.icon}}</v-icon>
        </template>
      </v-treeview>
    </v-navigation-drawer>

    <v-toolbar :clipped-left="$vuetify.breakpoint.lgAndUp" color="#e5eef7" app fixed>
      <v-toolbar-title class="ml-0 pl-0">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <logo></logo>

      </v-toolbar-title>
      <span class="title ml-3">Frontend</span>
      <v-spacer></v-spacer>
      <v-btn icon large href="https://github.com/nextgis/nextgisweb_frontend" target="_blank">
        <v-icon large>mdi-github-circle</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <component
        v-if="current"
        v-bind:is="current.component"
        :text="current.name"
        :description="current.description"
        :html="current.html"
      ></component>
    </v-content>
  </v-app>
</template>

<script lang="ts">
export { App as default } from "./App";
</script>


<style lang="scss">
* {
  padding: 0;
  margin: 0;
}

html,
body {
  width: 100%;
  height: 100%;
}

code:after,
kbd:after,
code:before,
kbd:before {
  content: "" !important;
  letter-spacing: 0 !important;
}

.header {
    backface-visibility: hidden;
    background-color: #e5eef7;
    border-bottom: 1px solid #d3e3f2;
    color: rgba(0,0,0,.87);
    font-size: 14px;
    font-weight: 400;
    height: 43px;
    left: 0;
    line-height: 43px;
    min-height: 43px;
    padding-left: 0;
    padding-right: 0;
    position: fixed;
    right: 0;
    top: 0;
    white-space: nowrap;
    width: 100%;
    z-index: 40;
}
</style>
