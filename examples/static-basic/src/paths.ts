import { locales } from './i18n';

// 静的化ではパラメータを発明できないので、宣言しなければビルドが落ちる。
// /:locale はロケールの定義が展開し、残る商品の id はここで並べる
export const paths = (patterns: readonly string[]): string[] =>
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
  });
