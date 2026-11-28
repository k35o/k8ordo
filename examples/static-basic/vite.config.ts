import { colorSchemeScriptHash } from '@k8ordo/color-scheme';
import { framework } from '@k8ordo/framework/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    framework({
      mode: 'static',
      // site は配信元の origin。request.url の origin と sitemap.xml の URL になる
      site: 'https://example.test',
      // どの応答にも付く。vite dev・vite preview・serve が送り、ビルドは
      // Netlify と Cloudflare が読む _headers に書く
      headers: { 'X-Content-Type-Options': 'nosniff' },
      // ポリシーはアプリが決める。フレームワークは自分のインラインスクリプトと
      // head に書く空の style のハッシュを足して、ページごとの <meta> に書く。
      // アプリのインラインスクリプト（color-scheme）は、そのハッシュをここで許す
      csp: {
        'script-src': ["'self'", await colorSchemeScriptHash()],
        'style-src': ["'self'"],
        'object-src': ["'none'"],
        'base-uri': ["'none'"],
      },
    }),
  ],
});
