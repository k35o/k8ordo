---
'docs': patch
---

- UI 以外の 7 パッケージに、Get Started から始まる話題別のガイドを足しました（form 4・state 5・router 5・static 6・server 7・i18n 5・color-scheme 2 ページ）。router の `matchPath`、i18n のロケールの交渉などは、その場で試せるデモ付きです。static と server で同じ話題は、文言と部品を 1 つにしてモードごとの差分だけを書き分けています。
- パッケージとそのセクションの一覧を `src/data/packages.ts` の 1 か所にまとめました。ヘッダーの 2 段目、フッターの列、トップページ、ランディングのセクション一覧、ガイドの前後ナビがそこを読みます。ランディングからは Get Started と `GUIDE.md` へ進めます。
- 既存の UI ページも実装に追従させました。Storybook へのリンクの id、動作要件の React のバージョン、`dictionaries` の案内、Toast / Textarea / Popover の例などです。
