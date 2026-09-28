import { framework } from '@k8ordo/server';
import { defineConfig } from 'vite';

// テストが「サブパスに置いても動く」を主張するための構成。dist/ の既定の
// 出力を上書きしないよう、出力先を dist/base/ の下に分ける
export default defineConfig({
  base: '/site/',
  plugins: [framework()],
  environments: {
    client: { build: { outDir: 'dist/base/client' } },
    ssr: { build: { outDir: 'dist/base/ssr' } },
    rsc: { build: { outDir: 'dist/base/rsc' } },
  },
});
