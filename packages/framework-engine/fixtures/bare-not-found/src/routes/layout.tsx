import type { ReactNode } from 'react';

import { Hydrated } from '../components/hydrated';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav>
          <a href="/nowhere">nowhere</a>
        </nav>
        <Hydrated />
        <main>{children}</main>
      </body>
    </html>
  );
}
