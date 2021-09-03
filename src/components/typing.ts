export interface FakeListItemProps {
  uid: string;
  height: number;
  render: boolean;
}

export interface CounterOption {
  id: string;
  height: number;
  check: boolean;
  items: string[];
}
