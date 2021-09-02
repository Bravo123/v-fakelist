<script lang="ts" setup>
import { computed, ref, watchEffect } from "vue";
import { store } from "../store";
import { CounterOption } from "./typing";

const props = defineProps<{ uid: string }>();

const data = ref<CounterOption>({} as CounterOption);

watchEffect(() => {
  data.value = store.get(props.uid)!;
});

const heightStyle = computed(() => {
  return {
    height: data.value.height + "px",
  };
});
</script>

<template>
  <div class="counter">
    <div class="flex">
      <span style="font-size: 35px">{{ uid }}</span>
      <label>
        <span> Height: </span>
        <input v-model.number="data.height" type="number" />
      </label>
    </div>
    <div class="flex-wrap">
      <span class="gap" v-for="o in data.items" :key="o"> {{ o }}</span>
    </div>
    <div class="fake-height" :style="heightStyle">{{ data.height }} px</div>
  </div>
</template>

<style scoped>
.flex {
  display: flex;
}

.flex-wrap {
  display: flex;
  flex-wrap: wrap;
}

.gap {
  margin-right: 10px;
}

.fake-height {
  background: rgb(206, 206, 206);
  border: 1px solid gray;
  margin: 10px;
  text-align: center;
  color: white;
  font-size: 30px;
}
</style>
