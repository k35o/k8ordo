# スペーシング・レイアウト

k8ordo UI は「余白で語る」デザイン。詰め込まず、空間にゆとりを持たせる。

## スペーシングの原則

4pt ベースのスペーシングシステム。Tailwind の標準スケールを使用。

### コンポーネント内部パディング

| 用途           | クラス | 値   |
| -------------- | ------ | ---- |
| コンパクト     | `p-4`  | 16px |
| 標準           | `p-6`  | 24px |
| ゆったり       | `p-8`  | 32px |
| 大きなカード内 | `p-10` | 40px |

### テキスト間の余白

| 関係性         | クラス  | 用途                         |
| -------------- | ------- | ---------------------------- |
| 近い要素       | `mt-2`  | 説明テキスト、ヘルプテキスト |
| 標準           | `mt-4`  | 段落間、フォームフィールド間 |
| セクション間   | `mt-8`  | セクション区切り             |
| 大セクション間 | `mt-12` | ページレベルの区切り         |

### セクション間の余白

| 関係性       | クラス              | 用途                       |
| ------------ | ------------------- | -------------------------- |
| カード間     | `gap-6`             | 横並びカード（グリッド内） |
| セクション間 | `gap-8` 〜 `gap-10` | 縦に並ぶセクション         |

## 角丸

**「触れるものは柔らかく、読むものは端正に」**

要素の性格に応じて角丸を使い分ける。

### 触れるもの（柔らかく）

| 用途                          | クラス         | 値     |
| ----------------------------- | -------------- | ------ |
| Button                        | `rounded-full` | ピル型 |
| Input, Textarea, Select       | `rounded-xl`   | 1rem   |
| Card, CheckboxCard, RadioCard | `rounded-xl`   | 1rem   |

### 読むもの（端正に）

| 用途     | クラス         | 値                           |
| -------- | -------------- | ---------------------------- |
| Alert    | `rounded-lg`   | 0.75rem                      |
| Badge    | `rounded-full` | ピル型（小さいので問題ない） |
| Tabs     | 現行のまま     |                              |
| Checkbox | `rounded-md`   | 0.5rem                       |

### その他

| 用途                               | クラス         |
| ---------------------------------- | -------------- |
| Dialog, Modal                      | `rounded-lg`   |
| Avatar, IconButton, プログレスバー | `rounded-full` |

## シャドウ

ふんわり柔らかい影で奥行きを表現する。

| 用途                     | スタイル                                                |
| ------------------------ | ------------------------------------------------------- |
| Card（デフォルト）       | `shadow-sm`（appearance="shadow" 時）                   |
| Card（ボーダー）         | `border border-border-mute`（appearance="bordered" 時） |
| Modal / Dialog / Tooltip | `shadow-md`                                             |
| Dropdown / ListBox       | `shadow-md`                                             |
| Button                   | なし                                                    |

`shadow-xl` 以上は使わない。

## ページ構造

### bg-subtle + 白カードの基本パターン

ページ背景を `bg-bg-subtle`（薄いグレー）にし、コンテンツを白いカードで浮かせる。

```tsx
// Good: 灰色背景に白カードが浮く
<div className="bg-bg-subtle min-h-screen">
  <Card appearance="shadow">
    <div className="p-8">コンテンツ</div>
  </Card>
</div>
```

### 余白で階層を作る

```tsx
// Good: 余白の差で関連度を示す
<section className="mt-12">
  <Heading level="h2">セクション</Heading>
  <p className="mt-2">直接関連する説明</p>
  <div className="mt-8">やや離れたコンテンツ</div>
</section>

// Bad: すべて同じ余白
<section className="mt-4">
  <Heading level="h2">セクション</Heading>
  <p className="mt-4">説明</p>
  <div className="mt-4">コンテンツ</div>
</section>
```

### カードは万能ではない

すべてのコンテンツをカードに入れる必要はない。余白とセパレーターで十分なケースが多い。

```tsx
import { Separator } from '@k8ordo/ui';

// Good: セパレーターで区切る
<div>
  <section>コンテンツA</section>
  <div className="py-8">
    <Separator />
  </div>
  <section>コンテンツB</section>
</div>

// 過剰: すべてカードに入れる
<Card>コンテンツA</Card>
<Card>コンテンツB</Card>
```

## やってはいけないこと

- `gap-1` や `p-1` のような極端に狭いスペーシング
- コンテンツの詰め込み（情報密度より余白を優先）
- ネストされたカード（Card in Card）
- 12 を超える z-index 値
