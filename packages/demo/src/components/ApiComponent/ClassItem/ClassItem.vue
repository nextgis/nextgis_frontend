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

    <example :item="item">
      <template v-slot:header>
        <h4>Examples</h4>
      </template>
    </example>


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
  padding-bottom: 16px;
}

.constructor-item > div:empty {
  padding: 0;
}
</style>
