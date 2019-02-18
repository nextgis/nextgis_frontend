<template>
  <v-container>
    <h3 class="pb-3">{{item.name}}</h3>

    <div v-for="g in getGithubSourceLinks(item)" :key="g">
      <a :href="g" target="_blank">github</a>
    </div>


    <div
      class="item-comment"
      v-if="item.comment && item.comment.shortText"
    >
      <pre><code class="markdown">{{item.comment.shortText}}</code></pre>
    </div>

    <constructor-item-component :classItem="item"></constructor-item-component>

    <!-- {{item}} -->
    <v-expansion-panel>
      <v-expansion-panel-content v-for="p in getAllowedMemders(item)" :key="p.id">
        <div slot="header">
          {{ p.name }}
          <!-- <p v-if="p.kindString === 'Property'"></p> -->
          <span v-if="p.kindString === 'Method'">
            (
            <span v-for="s in p.signatures" :key="s.id">
              <span v-for="p in s.parameters" :key="p.id">{{p.name}}</span>
            </span>
            )
          </span>
        </div>
        <v-card>
          <v-card-text>{{p}}</v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-container>
</template>

<script lang="ts">
export { ClassItemComponent as default } from './ClassItem';
</script>

<style lang="scss">
</style>
