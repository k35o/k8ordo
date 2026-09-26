import { colorSchemeScriptHash } from '@k8ordo/color-scheme';
import { framework } from '@k8ordo/static';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    framework({
      // 静的化ではパラメータを発明できないので、宣言しなければビルドが落ちる
      paths: () => ['/products/1', '/products/2'],
      // origin が分かれば sitemap.xml も書ける
      site: 'https://example.test',
      // ポリシーはアプリが決める。フレームワークは自分のインラインスクリプトの
      // ハッシュを script-src に足して、ページごとの <meta> に書く。アプリの
      // インラインスクリプト（color-scheme）は、そのハッシュをここで許す
      csp: {
        'script-src': ["'self'", await colorSchemeScriptHash()],
        'object-src': ["'none'"],
        'base-uri': ["'none'"],
      },
    }),
  ],
});
