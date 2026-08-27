# 生成 UI（json-render / OpenUI）

k8ordo UI は、LLM が k8ordo UI コンポーネントだけで UI を生成できる公式アダプタを同梱している。生成される UI はデザイントークンに固定され、ブランドから外れない。フレームワークは [json-render](https://json-render.dev) と [OpenUI](https://www.openui.com) の 2 つ。

いずれも optional peer dependency なので、使うフレームワークだけインストールする。

```bash
# json-render
pnpm add @json-render/core @json-render/react zod
# OpenUI
pnpm add @openuidev/react-lang zod
# OpenUI のサーバー安全な prompt エントリを使う場合は追加で:
pnpm add @openuidev/lang-core
```

## json-render

catalog（スキーマ・プロンプト）と registry（描画）が分かれており、catalog は**サーバー安全**。

### 1. サーバーでプロンプトを生成する

```tsx
import { catalog, arteOdysseyRules } from '@k8ordo/ui/json-render';

// customRules は LLM が破りやすい横断制約を注入する
// （Table のセル数を columns に一致 / href の形式 / Tabs・Accordion の content はテキストのみ）。
const systemPrompt = catalog.prompt({ customRules: [...arteOdysseyRules] });
```

### 2. クライアントで描画する

`JsonRenderUI` が `JSONUIProvider` + `Renderer` + registry を内部結線済みなので、spec を渡すだけでよい。フォーム値を回収するときは `onStateChange` を渡す。

```tsx
'use client';
import { JsonRenderUI } from '@k8ordo/ui/json-render/registry';

export function GenUi({ spec }: { spec: unknown }) {
  return <JsonRenderUI spec={spec} />;
}
```

高度な構成（独自の `navigate` / `handlers` / `validationFunctions`）が必要なら、低レベルの `registry` を `@json-render/react` の `JSONUIProvider` / `Renderer` に直接渡す。

### 3. LLM 出力を検証して描画 or 修復する

`validateGeneratedSpec` は機械修正 → 構造検証 → コンポーネントごとの props 検証を行い、失敗時はそのまま LLM に投げ返せる修復プロンプトを返す。`catalog.validate()` は現行の上流バージョンで正常 spec を誤って弾くため、こちらを使う。

```tsx
import { validateGeneratedSpec } from '@k8ordo/ui/json-render';

const result = validateGeneratedSpec(JSON.parse(llmOutput));
if (result.ok) {
  // result.fixes に自動修正の内容
  return <JsonRenderUI spec={result.spec} />;
}
// 壊れていたら修復プロンプトで再生成させる
const retried = await llm(result.repairPrompt);
```

### 4. 型付き spec（任意）

`satisfies ArteSpec` で書くと、component 名・props の typo がコンパイルエラーになり、`as unknown as Spec` が不要になる。

```tsx
import type { ArteSpec } from '@k8ordo/ui/json-render';

const spec = {
  root: 'root',
  elements: {
    root: { type: 'Stack', props: { direction: 'column' }, children: ['ok'] },
    ok: { type: 'Button', props: { label: 'OK' } },
  },
} satisfies ArteSpec;
```

`ComponentName` / `ComponentProps<K>` も export されており、特定コンポーネントの props 型を取り出せる。

## OpenUI

子要素を型付きサブコンポーネント（`z.array(Child.ref)`）で表すモデル。描画は `'use client'`。

```tsx
'use client';
import { library } from '@k8ordo/ui/openui';
import { Renderer } from '@openuidev/react-lang';

export function GenUi({ response }: { response: string }) {
  return <Renderer library={library} response={response} />;
}
```

システムプロンプトはサーバー安全な専用エントリで生成できる（json-render の `catalog.prompt()` と対称）。

```tsx
import { prompt } from '@k8ordo/ui/openui/prompt';

const systemPrompt = prompt(); // React 非依存。RSC / API ルートから呼べる
```

OpenUI では `Stack` / `Grid` の直下に `Stack` / `Grid` / `Card` を置けない（自己参照スキーマ非対応）。入れ子レイアウトが必要なら `Card` の中に `Stack` / `Grid` を入れる。json-render は slots ベースで自由に入れ子にできる。

## エクスポート早見表

| エクスポート                      | 区分           | 内容                                                                          |
| --------------------------------- | -------------- | ----------------------------------------------------------------------------- |
| `@k8ordo/ui/json-render`          | サーバー安全   | `catalog`, `validateGeneratedSpec`, `arteOdysseyRules`, 型（`ArteSpec` など） |
| `@k8ordo/ui/json-render/registry` | `'use client'` | `JsonRenderUI`（事前結線）, `registry`（低レベル）                            |
| `@k8ordo/ui/openui`               | `'use client'` | `library`（描画）                                                             |
| `@k8ordo/ui/openui/prompt`        | サーバー安全   | `prompt()`（プロンプト生成）                                                  |

> いずれも `@k8ordo/ui/styles.css`（Tailwind CSS 4 のプロジェクトは代わりに `@k8ordo/ui/tailwind.css`）の読み込みと `UIProvider` でのラップが前提。
