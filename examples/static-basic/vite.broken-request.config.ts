import { framework } from '@k8ordo/framework/vite';
import { defineConfig } from 'vite';

// build.test.ts が「リクエストの API を import したアプリは静的化できない」を
// 主張するための構成
export default defineConfig({
  plugins: [
    framework({ mode: 'static', routesDir: 'src/routes-broken-request' }),
  ],
});
