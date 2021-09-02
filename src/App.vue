<script setup lang="ts">
import { computed } from "vue";
import FakeList from "./components/FakeList.vue";
import { store } from "./store";
import Counter from "./components/Counter.vue";

const ids = computed(() => store.items.map((n) => n.id));
</script>

<template>
  <div class="app">
    <h1>Fake List</h1>
    <FakeList :ids="ids">
      <template #content="{ uid }">
        <Counter :uid="uid"></Counter>
      </template>
    </FakeList>
  </div>
</template>

<style></style>
