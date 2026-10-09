import { colorSchemeScriptHash } from '@k8ordo/color-scheme';
import { framework } from '@k8ordo/framework/vite';
import { defineConfig } from 'vite';

import { locales } from './src/i18n';

export default defineConfig({
  plugins: [
    framework({
      mode: 'static',
      // 静的化ではパラメータを発明できないので、宣言しなければビルドが落ちる。
      // /:locale はロケールの定義が展開し、残る商品の id はここで並べる
      paths: (patterns) =>
        locales.paths(patterns).flatMap((pathname) => {
          if (pathname === '/products/:id') {
            return ['/products/1', '/products/2'];
          }
          // 記事は 1 と 2 だけを書く。/en/posts/:id を残すとそこが殻の置き場所に
          // なり、ほかの id（ビルドの後に増えた記事）には fallback.tsx が答える。
          // id は書き並べる: posts.server.ts は server-only で、ここでは読めない
          if (pathname.endsWith('/posts/:id')) {
            return [
              pathname,
              pathname.replace(':id', '1'),
              pathname.replace(':id', '2'),
            ];
          }
          return [pathname];
        }),
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
