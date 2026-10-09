import { framework } from '@k8ordo/framework/vite';
import { defineConfig } from 'vite';

// build.test.ts と dev.test.ts が「guard.ts は静的化できない」を主張するための構成
export default defineConfig({
  plugins: [
    framework({ mode: 'static', routesDir: 'src/routes-broken-guard' }),
  ],
});
