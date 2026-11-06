/**
 * 描画の更新を 1 回越えるまで待つ。スタイルとレイアウトの計算、
 * ResizeObserver の通知、IntersectionObserver の通知を積むこと、
 * Chromium がフォーカスを持った無効な要素からフォーカスを外すことは、
 * どれもこの更新の中で起きる。
 *
 * requestAnimationFrame のコールバックは更新の初めに呼ばれるので、1 つだけ
 * 待っても、その回の更新はまだ済んでいない。2 つ目が呼ばれるのは次の回で、
 * そのときには前の回の更新と、そこで積まれたタスクが済んでいる。
 */
export const afterRenderingUpdate = async (): Promise<void> => {
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      resolve();
    });
  });
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      resolve();
    });
  });
};
