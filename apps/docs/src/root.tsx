import type { ReactNode } from 'react';

import './styles/globals.css';

export default function Root({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="UTF-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <title>k8ordo</title>
        <meta
          content="k8ordo - React UI Component Library"
          name="description"
        />
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link
          crossOrigin="anonymous"
          href="https://fonts.gstatic.com"
          rel="preconnect"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=M+PLUS+2:wght@400..700&family=Noto+Sans+JP:wght@400..700&display=swap"
          rel="stylesheet"
        />
        <script>
          {`const raw = localStorage.getItem('k8ordo-theme');
let t = null;
try { t = raw ? JSON.parse(raw) : null; } catch { t = raw; }
// 旧 sepia 値は廃止されたため light として扱う
if (t === 'dark' || ((t !== 'light') && matchMedia('(prefers-color-scheme:dark)').matches)) {
  document.documentElement.classList.add('dark');
}`}
        </script>
      </head>
      <body className="bg-bg-surface text-fg-base antialiased">{children}</body>
    </html>
  );
}
