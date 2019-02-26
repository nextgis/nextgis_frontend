<template>
  <div class="pb-4">

    <div class="subheader pb-2" v-for="g in getGithubSourceLinks(item)" :key="g" v-html="g"></div>

    <div
      class="item-comment"
      v-if="item.comment && item.comment.shortText"
    >
      <comment :text="item.comment.shortText" class="pb-3"></comment>
    </div>
    <constructor-item-component :item="item"></constructor-item-component>

    <div v-for="m in getAllowedMembers(item)" :key="m.name">
      <div v-if="m.members.length" class="pt-3">
        <h4>{{m.name}}</h4>
        <v-expansion-panel>
          <v-expansion-panel-content v-for="p in m.members" :key="p.id">
            <div slot="header">
              <!-- <span v-if="p.flags.isStatic" class="static-member">{{item.name}}.</span> -->
              <span v-if="p.kindString === 'Method'" v-html="createMethodString(p)">
              </span>
              <span v-else v-html="createTypedName(p)">
              </span>
            </div>
            <v-card>
              <v-card-text>
                <!-- <div class="subheader pb-1" v-for="g in getGithubSourceLinks(p)" :key="g" v-html="g"></div>
                <comment :comment="p.comment"></comment>
                <example :item="p"></example> -->
                <class :item="p"></class>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export { ClassItemComponent as default } from './ClassItem';
</script>

<style lang="scss">
.static-member {
  font-size: 0.9rem;
}
.subheader {
  font-size: 0.9rem;
}
</style>
