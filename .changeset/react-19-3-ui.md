---
'@k8ordo/ui': major
---

React 19.3 を前提にしました（peer は `react` / `react-dom` / `@types/react` / `@types/react-dom` とも `>=19.3.0`）。

- `useClient` を削除しました。ブラウザでしか描けないコンポーネントは React 自身の `use(browser())`（`react-dom` の `browser`）を `<Suspense>` の下で呼んでください。サーバーは fallback を残し、ブラウザが hydrate 後に描きます。「mounted フラグ」も `typeof window` も要りません。
- `Tabs` の選択を transition にし、パネルの入れ替わりを `<ViewTransition>` でクロスフェードするようにしました。suspend するパネルは用意できるまで今のパネルが残ります。
- `PortalRootProvider` を Context そのものにしました。`<PortalRootProvider value={ref}>` と書く点は同じですが、`value` は必須です。
- `Form` が `ref` を受け取るようになり、`@k8ordo/form` の `form.props` をそのまま広げられます。
- スタイルシートに、`prefers-reduced-motion` で View Transition のアニメーション（Tabs のパネル、ルーターのページ切替）を止める規則を足しました。
