import { colorSchemeScriptHash } from '@k8ordo/color-scheme';
import { framework } from '@k8ordo/static';
import { defineConfig } from 'vite';

import { locales } from './src/i18n';

export default defineConfig({
  plugins: [
    framework({
      // 静的化ではパラメータを発明できないので、宣言しなければビルドが落ちる。
      // /:locale はロケールの定義が展開し、残る商品の id はここで並べる
      paths: (patterns) =>
        locales
          .paths(patterns)
          .flatMap((pathname) =>
            pathname === '/products/:id'
              ? ['/products/1', '/products/2']
              : [pathname],
          ),
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
