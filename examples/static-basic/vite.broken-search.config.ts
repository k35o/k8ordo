import { framework } from '@k8ordo/static';
import { defineConfig } from 'vite';

// build.test.ts が「search を読むページは静的化できない」を主張するための構成
export default defineConfig({
  plugins: [framework({ routesDir: 'src/routes-broken-search' })],
});
