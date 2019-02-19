<template>
  <v-container>
    <h3 class="">{{item.name}}</h3>

    <div class="subheader pb-3" v-for="g in getGithubSourceLinks(item)" :key="g" v-html="g"></div>

    <div
      class="item-comment pb-3"
      v-if="item.comment && item.comment.shortText"
    >
      <comment :text="item.comment.shortText"></comment>
    </div>

    <constructor-item-component :classItem="item" class="pb-3"></constructor-item-component>

    <h4>Members</h4>
    <v-expansion-panel>
      <v-expansion-panel-content v-for="p in getAllowedMembers(item)" :key="p.id">
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
