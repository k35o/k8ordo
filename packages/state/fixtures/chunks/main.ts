// 2 つのページの真似。どちらも遅れて読み、片方だけが page state を定義する
Object.assign(globalThis, {
  pages: [() => import('./local'), () => import('./page')],
});
