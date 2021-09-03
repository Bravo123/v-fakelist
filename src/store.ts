import { reactive, ref } from "vue";
import { CounterOption } from "./components/typing";

const items = reactive<CounterOption[]>(
  new Array(1000).fill(0).map((_, idx) => newFakeItem(`item-${idx}`))
);

export function newFakeItem(uid: string) {
  return {
    id: uid,
    check: false,
    height: ~~(10 + Math.random() * 40),
    items: new Array(300).fill(0).map((_, idx) => String(idx)),
  };
}

export const debugInfo = reactive({
  renderSize: ref(20),
});

export const store = {
  items,
  get(id: string) {
    return items.find((i) => i.id === id);
  },
};
