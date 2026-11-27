import type { ReactNode } from 'react';

import { IdProbe } from '../components/id-probe';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <IdProbe name="layout" />
        <main>{children}</main>
      </body>
    </html>
  );
}
