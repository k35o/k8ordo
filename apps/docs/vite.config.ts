import { framework } from '@k8ordo/static';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

import { locales } from './src/i18n/locales';

export default defineConfig({
  server: {
    // プレビューツール等がポートを割り当てられるよう PORT を尊重する
    port: Number(process.env.PORT) || 5173,
  },
  plugins: [
    framework({
      // 配信元。これがあるとビルドが sitemap.xml も書く
      site: 'https://ordo.k8o.me',
      // ロケールは全ページに掛かる区間なので、埋まっていないパターンを
      // そのままロケールの数だけ展開する
      paths: (patterns) =>
        patterns.flatMap((pattern) =>
          locales.all.map((locale) =>
            pattern.replace('/:locale', `/${locale}`),
          ),
        ),
    }),
    tailwindcss(),
  ],
});
