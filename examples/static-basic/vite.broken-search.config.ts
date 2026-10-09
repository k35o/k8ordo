import { framework } from '@k8ordo/framework/vite';
import { defineConfig } from 'vite';

// build.test.ts が「search を読むページは静的化できない」を主張するための構成
export default defineConfig({
  plugins: [
    framework({ mode: 'static', routesDir: 'src/routes-broken-search' }),
  ],
});
