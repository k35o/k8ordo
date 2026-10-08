import { ColorSchemeProvider } from '@k8ordo/color-scheme';
import { href } from '@k8ordo/framework';
import type { LayoutProps } from '@k8ordo/framework';

import { locales } from '../i18n';
import { SchemeToggle } from './_parts/scheme';

// ディレクティブなし = Server Component（既定）
export default function RootLayout({ children, pathname }: LayoutProps<'/'>) {
  // [locale] の下なら URL のロケール、それ以外（404.html も）は既定の en
  const locale = locales.delocalize(pathname).locale ?? locales.default;
  return (
    // スクリプトがサーバーの描いていない dark を足すので、その差分は報告させない
    <html
      dir={locales.definitions[locale].dir}
      lang={locale}
      suppressHydrationWarning
    >
      <body>
        {/* このインラインスクリプトは、ハッシュを vite.config.ts の csp で許す */}
        <ColorSchemeProvider>
          <nav>
            {/* Navigation API の下では素の <a> がそのままクライアント遷移 */}
            <a href={href('/')}>home</a>{' '}
            <a href={href('/products')}>products</a>{' '}
            <a href={href('/products/:id', { id: 1 })}>product 1</a>{' '}
            <a href={href('/guide')}>guide</a>{' '}
            <a href={href('/:locale/about', { locale: 'en' })}>about</a>{' '}
            <SchemeToggle />
          </nav>
          <main>{children}</main>
        </ColorSchemeProvider>
      </body>
    </html>
  );
}
