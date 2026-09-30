---
"@k8ordo/state": major
---

1.0.0 として安定版にする。以後は semver に従い、公開 API を壊す変更は major でだけ出す。0.x だった `@k8ordo/*` のパッケージ（form・state・router・static・server・i18n・color-scheme）はそろって 1.0.0 になり、互いの peer は `^1.0.0` で結ぶ。

0.2.0 から上げるときに手を入れるもの（詳しくは下の各項目）:

- peer の `react` / `@types/react` を `>=19.3.0` に、optional peer の `@k8ordo/router` を `^0.1.0` から `^1.0.0` にした（型が router の `NavigablePath` を読む）。
- `RegisteredPath` を `RegisteredPath<Path>`（受け付けるパスなら `Path`、拒むなら `never`）にした。
- url に置く真偽値の配列は、要素を `z.stringbool()` で書く。`z.array(z.coerce.boolean())` / `z.array(z.boolean())` は定義のときに `TypeError` を投げる。
- `AnyState` に `SessionState` と `CookieState` が加わった。`def.kind` で網羅的に分けているコードは、この 2 つを足す。

この版で足した主なもの: `defineSessionState`、サーバーでも読める `defineCookieState`、保存する行の `version` / `migrate`、Vite の `base` を付けた `href`。
