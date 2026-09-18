---
'@k8ordo/ui': patch
---

同梱ドキュメントを実装に追従させました。

- `references/color.md` のトークン表（fg / bg / border / primary / secondary）を `tokens.css` の値に合わせ、載っていなかった `bg-raised` / `bg-surface` / `group-*` / `back-drop` などを足しました。`typography.md` / `spatial-design.md` / `interaction-design.md` / `GUIDE.md` の、存在しない `font-normal` や食い違っていた既定値も直しています。
- 改名前の prop 名（Card の `appearance`、Heading の `type` など）を今の名前にしました。
- `@k8ordo/ui/i18n` の `dictionaries` / `useMessages`、`@k8ordo/ui/tokens` / `@k8ordo/ui/props.json`、アイコン一覧を docs に載せました。
- `extract-props` が controlled / uncontrolled の union の片側しか読まず、`defaultValue` などを `never` と出していたのを直しました。`components.md` の Props は、残りの属性をどの要素へ転送するかも書くようになりました。
- README の peer 表を `package.json`（React / React DOM とその型は `>=19.3.0`）に合わせ、`ToolInvocation` の state を 7 値に、生成 UI の対応コンポーネント数を 48 にしました。
