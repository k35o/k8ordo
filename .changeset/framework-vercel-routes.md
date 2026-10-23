---
'@k8ordo/framework': minor
---

`vercel()` が `beforeFiles` と `beforeNotFound` を受け取るようになりました。`mode: 'static'` のビルドで、Vercel の Build Output API のルート（`src`・`dest`・`status`・`headers`・`continue`・`check`・`caseSensitive`・`has`）を、`.vercel/output/config.json` の2か所に渡したまま書きます。全ページのヘッダー、末尾のスラッシュのリダイレクト、`Accept` での出し分け、外のオリジンへの中継を、ビルドの出力に書けます。

- `beforeFiles` はどのファイルよりも前に、`beforeNotFound` はシェルの書き換えの後、`404.html` の前に置きます。全パスに当たるルートを `beforeNotFound` に置いても、シェルを隠しません。
- ルートを当てるのは Vercel だけです。`vite dev`・`vite preview`・`serve` には当てません。
- Vercel は `src` をパスの全体に当てます。`^/posts/` は `/posts/first` に当たらないので、`^/posts/.+$` のように書いてください。
- `mode: 'server'` で渡すと、ビルドを止めます。ファイルの無い URL にはハンドラが答えるためです。
- `has` のヘッダーの `key` が小文字でないと、`vercel()` を呼んだ時点で止めます。Vercel は小文字で比べるので、そのままでは当たらないおそれがあるためです。ほかは検査しません。
- 型 `VercelOptions` と `VercelRoute` を `@k8ordo/framework/vercel` から export します。
- 引数なしの `vercel()` が書くものは変わりません。
