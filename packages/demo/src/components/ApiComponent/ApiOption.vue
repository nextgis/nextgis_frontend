<template>
  <div>

    <v-data-table
      :items="properties"
      class="elevation-1"
      hide-actions
      hide-headers
    >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.name }}{{props.item.flags.isOptional ? '?' : ''}}</td>
        <td>{{ getOptionType(props.item.type) }}</td>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
export { ApiOption as default } from './ApiOption';
</script>

<style lang="scss">
</style>
