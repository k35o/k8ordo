import { k8ordoStatic } from '@k8ordo/static';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    k8ordoStatic({
      // 静的化ではパラメータを発明できないので、宣言しなければビルドが落ちる
      paths: () => ['/products/1', '/products/2'],
    }),
  ],
});
