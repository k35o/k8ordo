---
"@k8ordo/static": major
---

1.0.0 として安定版にする。以後は semver に従い、公開 API を壊す変更は major でだけ出す。0.x だった `@k8ordo/*` のパッケージ（form・state・router・static・server・i18n・color-scheme）はそろって 1.0.0 になり、互いの peer は `^1.0.0` で結ぶ。

0.1.0 から上げるときに手を入れるもの（詳しくは下の各項目）:

- peer の `react` / `react-dom` を `>=19.3.0`、`@k8ordo/router` を `^0.1.0` から `^1.0.0` にした。
- `sitemap(site, pathnames)` の export をやめた。`sitemap.xml` は引き続き `site` オプションでビルドが書く。
- `redirect.ts` を、表より先ではなく、表の中で宣言した順番（文字どおりの区間が先）に照合する。`[slug]/redirect.ts` の隣の `about/page.tsx` は `/about` で描かれる。
- Vite の `base` が根からのパスでない（`./` や別オリジン）ときは、ビルドを止める。

この版で足した主なもの: `route.ts`（ビルドが `GET` を 1 度呼んでファイルに書く）、`loading.tsx`、`notFound()`、`csp` オプション、Vite の `base` の下への配置、リンクの先読み。
