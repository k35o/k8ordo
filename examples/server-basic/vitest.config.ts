import { defineConfig } from 'vite-plus';

// テストの設定はここに置く。vite.config.ts はガイドが利用者に書かせるものと
// 同じ形（plugins だけ）に保ちたいので、混ぜない。ビルド成果物を読むだけの
// node テストなので、フレームワークのプラグインもここでは要らない
export default defineConfig({
  test: { globals: true, include: ['src/**/*.test.ts'] },
});
