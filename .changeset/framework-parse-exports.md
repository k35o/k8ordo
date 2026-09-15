---
'@k8ordo/static': minor
'@k8ordo/server': minor
---

- route ファイルの `paramsSchema` の検出を、正規表現による文字列走査から Vite 同梱のパーサ（oxc）に置き換えた。`export const { paramsSchema } = locales` のような分割代入も拾い、文字列やコメントの中の同じ語には反応しない。lint の autofix を抑止したり、コード例を別ファイルへ逃がしたりする必要が無くなった。
- `@k8ordo/server` の下では、生成する `register.gen.ts` が `@k8ordo/router` の `Register` に `request: RouteRequest` を書く。router の `PageProps` / `LayoutProps` はそこから `request` を得るので、route ファイルはモードのパッケージを import せずに済む。`routes.gen.ts` の `RouteRequest` も同じ型を `@k8ordo/server` から import する。
- ガイドの「Parameters with a schema」を `PageProps<'/products/:id'>` で書き直した。
