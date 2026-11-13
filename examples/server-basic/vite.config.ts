import { framework } from '@k8ordo/framework/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  // サーバーモードはパラメータを列挙しない。リクエストが来てから描くので、
  // 静的化のように事前にすべての URL を知っている必要がない。
  plugins: [
    framework({
      mode: 'server',
      // どの応答にも付く。ビルドのファイルは guard を通らないので、ファイルにも
      // 要るものはここに書く。ページの Content-Security-Policy は guard.ts が
      // nonce 付きで書き、同じ名前のこの値はそのまま残さない
      headers: {
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Content-Security-Policy': "default-src 'none'",
      },
    }),
  ],
});
