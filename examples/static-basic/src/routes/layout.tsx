import { ColorSchemeProvider, ColorSchemeScript } from '@k8ordo/color-scheme';
import { href, matchPath } from '@k8ordo/framework';
import type { LayoutProps } from '@k8ordo/framework';

import { SchemeToggle } from '../components/scheme';
import { locales } from '../i18n';

// ディレクティブなし = Server Component（既定）
export default function RootLayout({ children, pathname }: LayoutProps<'/'>) {
  const locale = locales.getLocale();
  const onProducts = matchPath('/products', pathname) !== null;
  const inProducts =
    matchPath('/products/*', pathname, { inclusive: true }) !== null;
  return (
    // スクリプトがサーバーの描いていない dark を足すので、その差分は報告させない
    <html
      dir={locales.definitions[locale].dir}
      lang={locale}
      suppressHydrationWarning
    >
      <head>
        <meta charSet="utf-8" />
        {/* このインラインスクリプトは、ハッシュを vite.config.ts の csp で許す */}
        <ColorSchemeScript />
      </head>
      <body>
        <ColorSchemeProvider>
          <nav>
            {/* Navigation API の下では素の <a> がそのままクライアント遷移 */}
            <a
              aria-current={
                matchPath('/', pathname) === null ? undefined : 'page'
              }
              href={href('/')}
            >
              home
            </a>{' '}
            <a
              aria-current={
                onProducts ? 'page' : inProducts ? 'true' : undefined
              }
              href={href('/products')}
            >
              products
            </a>{' '}
            <a
              aria-current={
                matchPath('/products/:id', pathname)?.id === '1'
                  ? 'page'
                  : undefined
              }
              href={href('/products/:id', { id: 1 })}
            >
              product 1
            </a>{' '}
            <a
              aria-current={
                matchPath('/guide', pathname) === null ? undefined : 'page'
              }
              href={href('/guide')}
            >
              guide
            </a>{' '}
            <a
              aria-current={
                matchPath('/:locale/about', pathname)?.locale === 'en'
                  ? 'page'
                  : undefined
              }
              href={href('/:locale/about', { locale: 'en' })}
            >
              about
            </a>{' '}
            <SchemeToggle />
          </nav>
          <main>{children}</main>
        </ColorSchemeProvider>
      </body>
    </html>
  );
}
