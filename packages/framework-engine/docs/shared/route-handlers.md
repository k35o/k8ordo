## Answers that are not pages

A `route.ts` answers its directory's URL with a `Response` rather than a
page — an RSS feed, `robots.txt`, JSON, a webhook. It exports a function for
each request method it answers:

```ts
// src/routes/feed.xml/route.ts
import type { RouteContext } from '@k8ordo/router';

export async function GET({ request }: RouteContext<'/feed.xml'>) {
  const origin = new URL(request.url).origin;
  return new Response(rss(origin, await listProducts()), {
    headers: { 'content-type': 'application/rss+xml;charset=utf-8' },
  });
}
```

A directory named like a file is an ordinary segment, so `feed.xml/route.ts`
answers `/feed.xml`. Each export receives `{ request, params }`: the
`Request`, and the params its pattern names, typed by the `paramsSchema`
exports along its stack as a page's are — a `route.ts` may export one too.
`RouteContext<P>` from `@k8ordo/router` is that type, and the generated table
checks each module against its pattern. A `route.ts` exporting none of `GET`,
`HEAD`, `POST`, `PUT`, `PATCH`, `DELETE` and `OPTIONS` is refused, since it
could only ever answer `405`.

A directory answers from a `route.ts` or renders a `page.tsx` (or redirects),
never two of them, and the layouts above a `route.ts` do not wrap it —
nothing renders. It takes its place in the table's order the way a page does,
literals before params, so `api/[id]/route.ts` beside `api/latest/page.tsx`
leaves `/api/latest` to the page. A client navigation to it gets no payload,
and loads the document instead.
