import { framework } from '@k8ordo/static';
import { defineConfig } from 'vite';

// build.test.ts が「サブパスに置いても動く」を主張するための構成。dist/ の
// 既定の出力を上書きしないよう、出力先を dist/base/ の下に分ける
export default defineConfig({
  base: '/site/',
  plugins: [
    framework({
      paths: () => ['/products/1', '/products/2'],
      site: 'https://example.test',
    }),
  ],
  environments: {
    client: { build: { outDir: 'dist/base/client' } },
    ssr: { build: { outDir: 'dist/base/ssr' } },
    rsc: { build: { outDir: 'dist/base/rsc' } },
  },
});
