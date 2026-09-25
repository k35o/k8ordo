### Fetching the next page ahead

The client runtime listens on the whole document for a pointer moving onto a
link, a link taking focus, and a press starting on one — `pointerover`,
`focusin` and `pointerdown` — and fetches that page's payload there and then,
so a click often finds the page already in hand. Nothing needs wiring: any
`<a>` counts, the ones a component library renders included.

Only a link a click would load in place is fetched: the same origin and below
Vite's `base`, no `download`, no `target` other than `_self`, and not the
page on screen, where only the search or the fragment would change. To stop
it for a link — one whose page is expensive to render, say — mark the link,
or any element around it, `data-k8ordo-prefetch="false"`
(`data-k8ordo-prefetch={false}` in JSX renders the same). The nearest element
carrying the attribute decides, so `"true"` opts a link back in inside a
region that opted out.

```tsx
<nav data-k8ordo-prefetch={false}>
  <a href="/reports">Reports</a>
  <a data-k8ordo-prefetch href="/">
    Home
  </a>
</nav>
```

What was fetched is used by the next navigation to that page, once, and only
if it starts within 30 seconds of the fetch starting. After that — or once a
navigation has used it — the page is fetched afresh, as it would have been
with nothing prefetched, so a page hovered and left alone never shows up
later as it was then. A Server Action's answer drops everything prefetched,
since the action may have changed what those pages show, and a prefetch that
failed is dropped at once, so the navigation asks again. A prefetch dropped
before any navigation used it is cancelled if it is still on its way, and one
a navigation took is cancelled with that navigation when another overtakes
it — the same as a fetch the navigation had started itself.

Under `@k8ordo/static` a prefetch is a request for a file. Under
`@k8ordo/server` it is a render, as a navigation is — the reason to mark a
link to an expensive page. The platform's Speculation Rules are not used:
they are Chromium's alone, not Baseline.
