import { framework } from '@k8ordo/static';
import { defineConfig } from 'vite';

import { locales } from './src/i18n';

// build.test.ts が「notFound() と言ったページのパスを列挙したらビルドが止まる」
// を主張するための構成。/products/3 はカタログに無い
export default defineConfig({
  plugins: [
    framework({
      paths: (patterns) =>
        locales
          .paths(patterns)
          .flatMap((pathname) =>
            pathname === '/products/:id'
              ? ['/products/1', '/products/3']
              : [pathname],
          ),
    }),
  ],
});
