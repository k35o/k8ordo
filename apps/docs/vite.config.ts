import betterCssModules from '@better-css-modules/vite';
import { framework } from '@k8ordo/framework/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    // プレビューツール等がポートを割り当てられるよう PORT を尊重する
    port: Number(process.env.PORT) || 5173,
  },
  plugins: [
    framework({
      mode: 'static',
      // site は配信元の origin。request.url の origin と sitemap.xml の URL になる
      site: 'https://ordo.k8o.me',
    }),
    betterCssModules(),
  ],
  // CSS Modules の @scope (&) は Lightning CSS でしか組めない
  css: { transformer: 'lightningcss' },
});
