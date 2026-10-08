import { framework } from '@k8ordo/framework/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  // サーバーモードはパラメータを列挙しない。リクエストが来てから描くので、
  // 静的化のように事前にすべての URL を知っている必要がない。
  plugins: [framework({ mode: 'server' })],
});
