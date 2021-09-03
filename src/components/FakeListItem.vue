<script lang="ts" setup>
defineProps<{ uid: string }>();
</script>
<template>
  <div class="fake-item" :key="uid" :data-fake-id="uid">
    <slot></slot>
  </div>
</template>
