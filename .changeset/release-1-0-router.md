---
"@k8ordo/router": major
---

1.0.0 として安定版にする。以後は semver に従い、公開 API を壊す変更は major でだけ出す。0.x だった `@k8ordo/*` のパッケージ（form・state・router・i18n・color-scheme）はそろって 1.0.0 になり、`@k8ordo/static` と `@k8ordo/server` をまとめた `@k8ordo/framework` も 1.0.0 で始まる。互いの peer は `^1.0.0` で結ぶ。

0.1.0 から上げるときに手を入れるもの（詳しくは下の各項目）:

- peer の `react` / `@types/react` を `>=19.3.0` にした。
- `RouteOf` を削除した。表と照合するパスの型は `NavigablePath<typeof routes, Path>` を使う。
- `href` の戻り値の型を、表のパスの形（`PathFor<P>`）から `string` にした。Vite の `base` を前に付けたリンク先の URL を返す。
- `useInterceptedNavigation` の `apply` は transition の外で呼ばれる。ホストは `apply` で設定した値を `useDeferredValue` を通して描く。

この版で足した主なもの: `bindParams`、`PageProps` / `LayoutProps`、`notFound()`、`route.ts` と `loading.tsx` のための型と `usePendingPathname()`、`<ViewTransition>` で使う transition type、Vite の `base` の付け外し（`withBase` / `withoutBase`）。
