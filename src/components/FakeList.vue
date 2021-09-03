<script setup lang="ts">
import { computed, onMounted, reactive, ref, watchEffect } from "vue";
import { debugInfo } from "../store";
import { measure, sleep } from "../utils";
import FakeListItem from "./FakeListItem.vue";
import { FakeListItemProps } from "./typing";

const props = defineProps<{
  ids: string[];
  minHeight?: number;
}>();

const data = reactive({
  items: [] as FakeListItemProps[],
  offScreenStyle: {
    width: "",
  },
});

const renderedItems = computed(() => data.items.filter((i) => i.render));

const heightsStyle = computed(() => {
  let beforeH = 0;
  let afterH = 0;
  let contentH = 0;

  let activeIdx = -1;

  data.items.forEach((item, idx) => {
    if (item.render && activeIdx === -1) {
      activeIdx = idx;
    }

    if (activeIdx === -1) {
      beforeH += item.height;
      return;
    }

    if (item.render) {
      contentH += item.height;
      return;
    }

    if (idx < activeIdx) {
      beforeH += item.height;
    } else {
      afterH += item.height;
    }
  });

  return {
    height: contentH + "px",
    paddingTop: beforeH + "px",
    paddingBottom: afterH + "px",
  };
});

const rootEl = ref<HTMLElement>();

let isMounted = false;

const cacheItems: Record<string, FakeListItemProps> = {};

const firstRenderSize = 20;

watchEffect(() => {
  data.items = props.ids.map((uid, idx) => {
    return (
      cacheItems[uid] ||
      (cacheItems[uid] = {
        uid,
        height: -1,
        render: idx < firstRenderSize,
      })
    );
  });

  if (isMounted) {
    firstRender();
  }
});

async function firstRender() {
  if (!rootEl.value) return;

  const allItems = data.items;

  const elNodes = rootEl.value.querySelectorAll("[data-fake-id]");

  elNodes.forEach((node) => {
    const uid = node.getAttribute("data-fake-id");

    const item = allItems.find((item) => item.uid === uid);

    if (!item || item.height !== -1) return;

    item.height = node.clientHeight;
  });

  allItems.forEach((item) => {
    if (item.height === -1) {
      item.height = props.minHeight || elNodes.item(0).clientHeight;
    }
  });
}

const updateActiveItems = async () => {
  if (!rootEl.value) return;

  const parentTop = rootEl.value.offsetTop;

  const offscreenSize = window.innerHeight * 3;

  const top = window.scrollY - offscreenSize;
  const maxTop = top + window.innerHeight + offscreenSize * 2;

  let preTop = parentTop;
  data.items.forEach((node) => {
    const minY = preTop;
    const maxY = minY + node.height;

    const inView =
      (minY >= top && minY <= maxTop) ||
      (maxY >= top && maxY <= maxTop) ||
      (minY <= top && maxY >= maxTop);

    node.render = inView;

    preTop += node.height;
  });

  debugInfo.renderSize = data.items.filter((i) => i.render).length;
};

onMounted(() => {
  firstRender();
  isMounted = true;

  document.onscroll = (ev) => {
    updateActiveItems();

    // measure("update active items", () => {
    //   updateActiveItems();
    // });
  };
});
</script>

<template>
  <div ref="rootEl" class="rendered" :style="heightsStyle">
    <FakeListItem
      v-for="o in renderedItems"
      :key="o.uid"
      :uid="o.uid"
      v-model:height="o.height"
    >
      <slot name="content" :uid="o.uid"></slot>
    </FakeListItem>
  </div>
</template>

<style scoped></style>
