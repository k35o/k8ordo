import betterCssModules from '@better-css-modules/vite';
import { framework } from '@k8ordo/framework/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

import { locales } from './src/i18n';

export default defineConfig({
  server: {
    // プレビューツール等がポートを割り当てられるよう PORT を尊重する
    port: Number(process.env.PORT) || 5173,
  },
  plugins: [
    framework({
      mode: 'static',
      // 配信元。これがあるとビルドが sitemap.xml も書く
      site: 'https://ordo.k8o.me',
      // ロケールは全ページに掛かる区間で、集合が自分で展開する
      paths: locales.paths,
    }),
    betterCssModules(),
    tailwindcss(),
  ],
  // CSS Modules の @scope (&) は Lightning CSS でしか組めない。target は
  // @k8ordo/ui と同じく新しいブラウザにして、:dir() などを書き換えさせない
  css: { transformer: 'lightningcss' },
  build: { cssTarget: ['chrome146', 'edge146', 'firefox151', 'safari26'] },
});
