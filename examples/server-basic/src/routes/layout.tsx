import { href } from '@k8ordo/router';
import type { ReactNode } from 'react';

import { Where } from './_parts/where';

// ディレクティブなし = Server Component（既定）
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav>
          {/* Navigation API の下では素の <a> がそのままクライアント遷移 */}
          <a href={href('/')}>home</a> <a href={href('/products')}>products</a>{' '}
          <a href={href('/products/:id', { id: '1' })}>product 1</a>{' '}
          <a href={href('/guide')}>guide</a>
        </nav>
        <Where />
        <main>{children}</main>
      </body>
    </html>
  );
}
