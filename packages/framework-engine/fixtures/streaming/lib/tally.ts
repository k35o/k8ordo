// アクションが進め、ページが読む数。サーバーのプロセスに 1 つ
let count = 0;

export const tally = (): number => count;

export const step = (): number => {
  count += 1;
  return count;
};
