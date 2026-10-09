import { framework } from '@k8ordo/framework/vite';
import { defineConfig } from 'vite';

import { locales } from './src/i18n';

// build.test.ts が「サブパスに置いても動く」を主張するための構成。dist/ の
// 既定の出力を上書きしないよう、出力先を dist/base/ の下に分ける
export default defineConfig({
  base: '/site/',
  plugins: [
    framework({
      mode: 'static',
      paths: (patterns) =>
        locales.paths(patterns).flatMap((pathname) => {
          if (pathname === '/products/:id') {
            return ['/products/1', '/products/2'];
          }
          if (pathname.endsWith('/posts/:id')) {
            return [
              pathname,
              pathname.replace(':id', '1'),
              pathname.replace(':id', '2'),
            ];
          }
          return [pathname];
        }),
      site: 'https://example.test',
    }),
  ],
  environments: {
    client: { build: { outDir: 'dist/base/client' } },
    ssr: { build: { outDir: 'dist/base/ssr' } },
    rsc: { build: { outDir: 'dist/base/rsc' } },
  },
});
