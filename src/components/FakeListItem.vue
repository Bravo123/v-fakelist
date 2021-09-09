<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from "vue";

const props = defineProps<{
  uid: string;
  height: number;
}>();

const style = computed(() => {
  return {
    height: props.height + "px",
  };
});

const contentEl = ref<HTMLElement>();

const emits = defineEmits(["update:height"]);

const resizeObserver = new ResizeObserver(() => {
  if (!contentEl.value) return;

  emits("update:height", contentEl.value.clientHeight);
});

onMounted(() => {
  if (!contentEl.value) return;
  resizeObserver.observe(contentEl.value);

  emits("update:height", contentEl.value.clientHeight);
});

onUnmounted(() => {
  resizeObserver.disconnect();
});
</script>

<template>
  <div class="fake-item" :key="uid" :data-fake-id="uid" :style="style">
    <div ref="contentEl">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.fake-item {
  /* overflow: hidden;
  transition: height ease .2s; */
}
</style>
