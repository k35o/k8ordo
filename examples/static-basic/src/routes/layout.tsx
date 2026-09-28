import { ColorSchemeProvider } from '@k8ordo/color-scheme';
import { href } from '@k8ordo/router';
import type { ReactNode } from 'react';

import { SchemeToggle } from './_parts/scheme';

// ディレクティブなし = Server Component（既定）
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // スクリプトがサーバーの描いていない dark を足すので、その差分は報告させない
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* このインラインスクリプトは、ハッシュを vite.config.ts の csp で許す */}
        <ColorSchemeProvider>
          <nav>
            {/* Navigation API の下では素の <a> がそのままクライアント遷移 */}
            <a href={href('/')}>home</a>{' '}
            <a href={href('/products')}>products</a>{' '}
            <a href={href('/products/:id', { id: 1 })}>product 1</a>{' '}
            <a href={href('/guide')}>guide</a> <SchemeToggle />
          </nav>
          <main>{children}</main>
        </ColorSchemeProvider>
      </body>
    </html>
  );
}
