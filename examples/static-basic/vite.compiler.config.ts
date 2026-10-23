import { framework } from '@k8ordo/framework/vite';
import { defineConfig } from 'vite';

import { locales } from './src/i18n';

// build.test.ts が「React Compiler は client の出力にだけ掛かる」を主張する
// ための構成。dist/ の既定の出力を上書きしないよう、出力先を dist/compiler/ の
// 下に分ける。どの出力に何が入ったかは、ソースマップの sources で読む
export default defineConfig({
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
      reactCompiler: true,
    }),
  ],
  build: { sourcemap: true },
  environments: {
    client: { build: { outDir: 'dist/compiler/client' } },
    ssr: { build: { outDir: 'dist/compiler/ssr' } },
    rsc: { build: { outDir: 'dist/compiler/rsc' } },
  },
});
