import type { ReactNode } from 'react';

import { Badge } from '../components/badge';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Badge />
        <main>{children}</main>
      </body>
    </html>
  );
}
