<template>
  <div>
    <h2 :id="item.name" class="pt-3" >
      <v-btn flat icon small color="" @click="$root.goTo(item.name)">
        <v-icon>mdi-pound</v-icon>
      </v-btn>
      {{item.name}}
    </h2>

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
          <span v-if="p.kindString === 'Method'" v-html="createMethodString(p) ">
          </span>
          <span v-else v-html="createTypedName(p)">
          </span>
        </div>
        <v-card>
          <v-card-text>
            <div class="subheader pb-1" v-for="g in getGithubSourceLinks(p)" :key="g" v-html="g"></div>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </div>
</template>

<script lang="ts">
export { ClassItemComponent as default } from './ClassItem';
</script>

<style lang="scss">
</style>
