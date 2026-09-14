import { defineConfig } from 'vite-plus';

// テストの設定はここに置く。vite.config.ts はガイドが利用者に書かせるものと
// 同じ形（plugins だけ）に保ちたいので、混ぜない。ビルド成果物を読むだけの
// node テストなので、フレームワークのプラグインもここでは要らない
export default defineConfig({
  test: {
    globals: true,
    fsModuleCache: true,
    include: ['src/**/*.test.ts'],
    // build.test.ts のビルドも dev.test.ts の dev サーバも、同じ
    // .k8ordo/routes.gen.ts をそれぞれの routesDir から書き直す。並行させると
    // 片方が書いている最中の中身をもう片方が読む
    fileParallelism: false,
  },
});
