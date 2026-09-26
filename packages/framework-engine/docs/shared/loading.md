## While a page loads

A `loading.tsx` beside a `layout.tsx` (or a `page.tsx`) is what shows while
what is below it suspends: a `<Suspense>` the framework puts at that level,
inside its `error.tsx` boundary, so what the boundary catches is what the
fallback stood in for.

```tsx
// src/routes/products/loading.tsx
export default function ProductsLoading() {
  return <p>loading products…</p>;
}
```

It receives no props. It shows when a client navigation enters its directory
while the page there is still on its way, and for whatever inside the page
suspends as it streams. A page change below one already on screen keeps the
current page showing while the next one loads — every page change renders in
the background — and `usePendingPathname()` from `@k8ordo/router` is how a
link or a bar says that one is under way:

```tsx
'use client';

import { usePendingPathname } from '@k8ordo/router';

export function Progress() {
  const pending = usePendingPathname();
  return pending === null ? null : <p role="status">loading {pending}…</p>;
}
```
