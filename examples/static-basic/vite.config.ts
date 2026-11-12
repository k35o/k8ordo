import { colorSchemeScriptHash } from '@k8ordo/color-scheme';
import { framework } from '@k8ordo/framework/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    framework({
      mode: 'static',
      // origin が分かれば sitemap.xml も書ける
      site: 'https://example.test',
      // ポリシーはアプリが決める。フレームワークは自分のインラインスクリプトと
      // head に書く空の style のハッシュを足して、ページごとの <meta> に書く。
      // アプリのインラインスクリプト（color-scheme）は、そのハッシュをここで許す
      csp: {
        'script-src': ["'self'", await colorSchemeScriptHash()],
        'style-src': ["'self'"],
        'object-src': ["'none'"],
        'base-uri': ["'none'"],
      },
    }),
  ],
});
