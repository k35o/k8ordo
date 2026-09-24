import { framework } from '@k8ordo/static';
import { defineConfig } from 'vite';

// build.test.ts が「境界の無いページの throw もページ名を挙げてビルドを止める」を
// 主張するための構成
export default defineConfig({
  plugins: [framework({ routesDir: 'src/routes-broken-no-boundary' })],
});
