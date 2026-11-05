import { defineConfig } from 'vite-plus';

// テストの設定はここに置く。vite.config.ts はガイドが利用者に書かせるものと
// 同じ形（plugins だけ）に保ちたいので、混ぜない。ビルド成果物を読むだけの
// node テストなので、フレームワークのプラグインもここでは要らない
export default defineConfig({
  test: {
    fsModuleCache: true,
    include: ['src/**/*.test.ts'],
    // dev.test.ts は src/routes を書き換えて dev サーバの入れ替えを確かめる。
    // 同じソースを読む build.test.ts のビルドと並べると、書き換えの途中を
    // ビルドが拾う
    fileParallelism: false,
  },
});
