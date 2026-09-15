---
'docs': patch
---

- 全リンクを `src/links.ts`（router の `bindParams` にロケールを束ねた `href` / `navigateTo`）に載せ替えた。行き先は `/:locale/…` のパターンで、無いページは型で落ちる。`LocaleAnchor` と nav データもその型（`SitePath`）で受ける。
- `vite.config.ts` の `paths` は `locales.paths`、`UIProvider` の辞書は `dictionaries[locale]`、`[locale]/layout.tsx` の `paramsSchema` は分割代入で export、i18n のコード例はページに戻した。
