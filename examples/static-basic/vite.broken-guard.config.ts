import { framework } from '@k8ordo/static';
import { defineConfig } from 'vite';

// build.test.ts と dev.test.ts が「guard.ts は静的化できない」を主張するための構成
export default defineConfig({
  plugins: [framework({ routesDir: 'src/routes-broken-guard' })],
});
