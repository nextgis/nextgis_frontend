<template>
  <div class="pb-4">

    <div class="subheader pb-2" v-for="g in getGithubSourceLinks(item)" :key="g" v-html="g"></div>

    <div
      class="item-comment"
      v-if="item.comment && item.comment.shortText"
    >
      <comment :text="item.comment.shortText"></comment>
    </div>

    <constructor-item-component :item="item" class="constructor-item"></constructor-item-component>

    <div v-if="item.kindString === 'Property'">
      <property :item="item"></property>
    </div>

    <example :item="item">
      <template v-slot:header>
        <h4>Examples</h4>
      </template>
    </example>

    <div v-if="showMembers">
      <div v-for="m in getAllowedMembers(item)" :key="m.name">
        <div v-if="m.members.length" class="pb-2">
          <h4>{{m.name}}</h4>
          <v-expansion-panel>
            <v-expansion-panel-content v-for="p in m.members" :key="p.id" lazy>
              <div slot="header">
                <!-- <span v-if="p.flags.isStatic" class="static-member">{{item.name}}.</span> -->
                <span v-if="p.kindString === 'Method'" v-html="createMethodString(p)">
                </span>
                <span v-else v-html="p.name">
                </span>
              </div>
              <v-card>
                <v-card-text>
                  <class :item="p"></class>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </div>
      </div>
    </div>

    <slot name="footer"></slot>

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

.constructor-item > div {
  padding-bottom: 0px;
}

.constructor-item > div:empty {
  padding: 0;
}

// .constructor-item code {
//   margin-bottom: 16px;
// }
</style>
