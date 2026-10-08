import { framework } from '@k8ordo/framework/vite';
import { defineConfig } from 'vite';

import { locales } from './src/i18n';

// build.test.ts が「ページでないパスを列挙したらビルドが止まる」を主張する
// ための構成。/products/3 はカタログに無く、/products/x はスキーマが拒む
export default defineConfig({
  plugins: [
    framework({
      mode: 'static',
      paths: (patterns) =>
        locales
          .paths(patterns)
          .flatMap((pathname) =>
            pathname === '/products/:id'
              ? ['/products/1', '/products/3', '/products/x']
              : [pathname],
          ),
    }),
  ],
});
