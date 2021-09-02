<script lang="ts" setup>
export interface FakeListItemProps {
  uid: string;
  height: number;
  render: boolean;
}

defineProps<FakeListItemProps>();

function getItemStyle(item: FakeListItemProps) {
  return {
    minHeight: item.height + "px",
  };
}
</script>
<template>
  <div
    class="fake-item"
    :key="uid"
    :data-fake-id="uid"
    :style="getItemStyle($props)"
  >
    <slot></slot>
  </div>
</template>
