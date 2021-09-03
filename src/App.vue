<script setup lang="ts">
import { computed, reactive, watchEffect } from "vue";
import FakeList from "./components/FakeList.vue";
import { newFakeItem, store } from "./store";
import Counter from "./components/Counter.vue";

const ids = computed(() => store.items.map((n) => n.id));

function selectAll(e: Event) {
  store.items.forEach((item) => {
    item.check = (e.target as HTMLInputElement).checked;
  });
}

const data = reactive({
  length: 1000,
});

watchEffect(() => {
  const len = data.length;

  if (store.items.length >= len) {
    store.items.length = len;
  } else {
    const oldLen = store.items.length;

    store.items.push(
      ...new Array(len - oldLen).fill(0).map((_, idx) =>
        newFakeItem(`item-${oldLen + idx}`)
      )
    );

  }
  console.log(store.items.length);
});
</script>

<template>
  <div class="app">
    <h1>
      Fake List:
      <label>
        <span>Select All</span>
        <input type="checkbox" @change="selectAll" />
      </label>
      <label>
        <span>list Length:</span>
        <input v-model.number="data.length" type="number" />
      </label>
    </h1>
    <FakeList :ids="ids">
      <template #content="{ uid }">
        <Counter :uid="uid"></Counter>
      </template>
    </FakeList>
  </div>
</template>

<style></style>
