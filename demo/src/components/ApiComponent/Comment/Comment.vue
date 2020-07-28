<template>
  <div class="comment" v-html="str"></div>
</template>

<script lang="ts">
export { Comment as default } from "./Comment";
</script>

<style>
.comment .code {
  font-weight: bold;
}

.comment p {
  margin-bottom: 4px;
}
</style>
