import { reactive } from "vue";
import { CounterOption } from "./components/typing";

const items = reactive<CounterOption[]>(
  new Array(1000).fill(0).map((_, idx) => ({
    id: `item-${idx}`,
    check: false,
    height: ~~(100 + Math.random() * 200),
    items: new Array(300).fill(0).map((_, idx) => String(idx)),
  }))
);

export const store = {
  items,
  get(id: string) {
    return items.find((i) => i.id === id);
  },
};
