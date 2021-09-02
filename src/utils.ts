export const sleep = (ts: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ts));

export const measure = async (label: string, fn: () => any) => {
  const now = performance.now();
  await fn();
  console.log(label, performance.now() - now);
};
