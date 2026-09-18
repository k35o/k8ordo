import { framework } from '@k8ordo/static';
import { defineConfig } from 'vite';

// build.test.ts が「描画に失敗するページはビルドを止める」を主張するための構成
export default defineConfig({
  plugins: [framework({ routesDir: 'src/routes-broken' })],
});
