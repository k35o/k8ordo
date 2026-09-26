import { framework } from '@k8ordo/static';
import { defineConfig } from 'vite';

// build.test.ts が「GET 以外を export する route.ts は静的化できない」を
// 主張するための構成
export default defineConfig({
  plugins: [framework({ routesDir: 'src/routes-broken-route' })],
});
