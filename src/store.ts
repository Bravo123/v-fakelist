import { reactive } from "vue";
import { CounterOption } from "./components/typing";

const items = reactive<CounterOption[]>(
  new Array(1000).fill(0).map((_, idx) => ({
    id: `item-${idx}`,
    height: 50,
    items: new Array(100).fill(0).map((_, idx) => String(idx)),
  }))
);

export const store = {
  items,
  get(id: string) {
    return items.find((i) => i.id === id);
  },
};
