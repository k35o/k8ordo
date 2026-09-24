---
"@k8ordo/ui": minor
---

生成 UI アダプタが LLM に渡す文言を、すべて英語にしました。json-render のカタログと OpenUI の定義にある部品の説明、`uiRules`、スキーマの説明（`.describe()`）、`validateGeneratedSpec` が修復プロンプトに載せる `href` / `action` の検証メッセージが対象です。モデルが読むだけで利用者の画面には出ない文言なので、アプリのロケールとは切り離しました。

- `catalog.prompt()` と `prompt()`（`@k8ordo/ui/openui/prompt`）が返すシステムプロンプトの文面が変わります。登録している部品・props・スキーマの形は変わらず、描画にも影響しません。
- 日本語の説明に引かれて、モデルが UI の文言を日本語で書いていた場合は、英語に寄る可能性があります。UI の言語を固定したいときは `catalog.prompt({ customRules: [...uiRules, 'Write all UI text in Japanese.'] })` や `prompt({ additionalRules: ['Write all UI text in Japanese.'] })` のように規則を足してください。
- `validateGeneratedSpec` の `issues[].message` のうち、`href` / `action` の形式違反のメッセージも英語になりました。日本語の文言に一致させている処理があれば見直してください。

あわせて `docs/references/generative-ui.md` に、カタログが扱う部品、意図的に外している export（`InView` / `Resize` / `UIProvider` / `PortalRootProvider` / `usePortalRoot` と `/ai` のチャット部品）とその理由、プロンプトの言語を固定する方法を書きました。
