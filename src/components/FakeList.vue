<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch, watchEffect } from "vue";
import { debugInfo, store } from "../store";
import { measure, sleep } from "../utils";
import FakeListItem from "./FakeListItem.vue";
import { FakeListItemProps } from "./typing";

const props = defineProps<{
  ids: string[];
  minHeight?: number;
}>();

const data = reactive({
  items: [] as FakeListItemProps[],
  hidden: [] as FakeListItemProps[],
  offScreenStyle: {
    width: "",
  },
});

const renderedItems = computed(() => data.items.filter((i) => i.render));

const heightsStyle = computed(() => {
  let beforeH = 0;
  let afterH = 0;

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
      return;
    }

    if (idx < activeIdx) {
      beforeH += item.height;
    } else {
      afterH += item.height;
    }
  });

  return {
    paddingTop: beforeH + "px",
    paddingBottom: afterH + "px",
  };
});

const renderEl = ref<HTMLElement>();
const rootEl = ref<HTMLElement>();

const cacheItems: Record<string, FakeListItemProps> = {};

watchEffect(() => {
  data.items = props.ids.map((uid) => {
    return (
      cacheItems[uid] ||
      (cacheItems[uid] = {
        uid,
        height: -1,
        render: false,
      })
    );
  });
});

async function firstRender() {
  if (!renderEl.value || !rootEl.value) return;

  const firstRenderSize = 20;
  const allItems = data.items;

  allItems.slice(0, firstRenderSize).forEach((n) => (n.render = true));

  await sleep(10);

  const elNodes = rootEl.value.querySelectorAll("[data-fake-id]");

  elNodes.forEach((node) => {
    const uid = node.getAttribute("data-fake-id");

    const item = allItems.find((item) => item.uid === uid);

    if (!item || item.height !== -1) return;

    item.height = node.clientHeight;
  });

  allItems.forEach((item) => {
    if (item.height === -1) {
      item.height = props.minHeight || 100;
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

const updateNodeHeight = (target: Element) => {
  const uid = target.getAttribute("data-fake-id");
  const item = data.items.find((i) => i.uid === uid);

  if (item && item.render) {
    item.height = target.clientHeight;
  }
};

const resizeObserver = new ResizeObserver((entries) => {
  for (let entry of entries) {
    updateNodeHeight(entry.target);
  }
});

function observeItemHeightChanged() {
  if (!renderEl.value) {
    return;
  }

  resizeObserver.disconnect();
  const elNodes = renderEl.value.querySelectorAll("[data-fake-id]");

  elNodes.forEach((node) => {
    resizeObserver.observe(node);
  });
}

onMounted(() => {
  firstRender();

  document.onscroll = (ev) => {
    updateActiveItems();
    observeItemHeightChanged();

    // measure("update active items", () => {
    //   updateActiveItems();
    //   observeItemHeightChanged();
    // });
  };
});
</script>

<template>
  <div class="fake-list" ref="rootEl">
    <div ref="renderEl" class="rendered" :style="heightsStyle">
      <FakeListItem v-for="o in renderedItems" :key="o.uid" :uid="o.uid">
        <slot name="content" :uid="o.uid"></slot>
      </FakeListItem>
    </div>
  </div>
</template>

<style scoped>
.off-screen {
  position: fixed;
  top: 110vh;
}
</style>
