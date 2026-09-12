---
'docs': patch
---

サイトの i18n 層を `@k8ordo/i18n` に載せ替えた。`MESSAGE_KEYS` の手書き一覧と `utils.ts` / `context.tsx` を消し、ロケール集合は `defineLocales`、辞書は `defineDictionary`（`en` は `Translations<typeof ja>`）から出す。`[locale]` の `paramsSchema`、ルートレイアウトの `lang`、`vite.config.ts` のパス展開、`/` の振り分けは全部同じ `locales` を読む。`/i18n` のランディングを足し、`/ui/i18n` の文言キーは `uiI18n.*` に改名した。
