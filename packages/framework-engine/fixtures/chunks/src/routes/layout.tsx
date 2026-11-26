import type { ReactNode } from 'react';

import { Hydrated } from '../components/hydrated';
import { Scheme } from '../components/scheme';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav>
          <a href="/a">to a</a> <a href="/b">to b</a>
        </nav>
        <Hydrated />
        <Scheme>
          <main>{children}</main>
        </Scheme>
      </body>
    </html>
  );
}
