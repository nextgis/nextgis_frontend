<template>
  <div>
    <v-data-table
      v-if="properties.length"
      :items="properties"
      class="elevation-1"
      hide-default-footer
      hide-default-header
    >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.name }}{{props.item.flags.isOptional ? '?' : ''}}</td>
        <td>
          <code v-html="getOptionType(props.item)"></code>
        </td>
        <td>
          <comment :comment="props.item.comment"></comment>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
export { ApiOption as default } from "./ApiOption";
</script>

<style>
</style>
