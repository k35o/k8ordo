# タイポグラフィ

k8ordo UI のタイポグラフィは「読みやすさ」と「静けさ」を両立する。

## フォントファミリー

日本語最適化のフォントスタック。

```css
font-family: 'Noto Sans JP', 'M PLUS 2', sans-serif;
```

- **Inter / Roboto / Open Sans は使わない** — AI が生成した感が出る
- 日本語テキストが主体のため、和文フォントを優先

## フォントサイズスケール

| Tailwind クラス  | 値       | 用途                 |
| ---------------- | -------- | -------------------- |
| `text-xs`        | 0.75rem  | 注釈、キャプション   |
| `text-sm`        | 0.875rem | 補足テキスト、ラベル |
| `text-md`        | 1rem     | 本文（デフォルト）   |
| `text-lg`        | 1.125rem | 小見出し             |
| `text-xl`        | 1.25rem  | 見出し               |
| `text-2xl`       | 1.5rem   | 大見出し             |
| `text-3xl`       | 1.875rem | ページタイトル       |
| `text-emphasize` | 3rem     | 強調表示             |
| `text-highlight` | 6rem     | ハイライト表示       |

## フォントウェイト

ウェイトは控えめに使う。太字の多用は「静けさ」を損なう。

| Tailwind クラス | 値  | 用途                         |
| --------------- | --- | ---------------------------- |
| `font-normal`   | 400 | 本文                         |
| `font-medium`   | 450 | 強調テキスト（控えめな強調） |
| `font-bold`     | 700 | 見出し、ボタンラベル         |

- `font-semibold` (600) や `font-extrabold` (800) は使わない
- `font-medium` が 450 であることに注意（一般的な 500 より軽い）

## 行間

日本語テキストは欧文より広い行間が必要。

| Tailwind クラス   | 値    | 用途                     |
| ----------------- | ----- | ------------------------ |
| `leading-none`    | 1     | 特殊用途（highlight 等） |
| `leading-tight`   | 1.25  | 見出し                   |
| `leading-snug`    | 1.375 | 小見出し                 |
| `leading-normal`  | 1.5   | リスト内、デフォルト     |
| `leading-relaxed` | 1.625 | 本文（推奨）             |
| `leading-loose`   | 2     | 広い行間が必要な場合     |

## 字間

| Tailwind クラス   | 値      | 用途             |
| ----------------- | ------- | ---------------- |
| `tracking-none`   | 0em     | デフォルト       |
| `tracking-normal` | 0.025em | 少し広げたい場合 |

## Heading コンポーネント

見出しには `Heading` コンポーネントを使う。

```tsx
import { Heading } from '@k8ordo/ui';

<Heading level="h1">ページタイトル</Heading>
<Heading level="h2">セクション見出し</Heading>
<Heading level="h3">サブセクション</Heading>
```

## 縦書きモード

縦書き表示には専用のユーティリティと variant を用意している。

### ユーティリティ

| Tailwind クラス | 用途                                                                                                        |
| --------------- | ----------------------------------------------------------------------------------------------------------- |
| `writing-h`     | 横書き (`writing-mode: horizontal-tb`) に戻す。縦書きツリー内の図表・コードブロック・置換要素などで使う。   |
| `writing-v`     | 縦書き (`writing-mode: vertical-rl`) を適用し、`text-orientation: mixed` などの推奨初期値も一括で設定する。 |

### `vertical:` variant

`.writing-v` 子孫で活性化し、`.writing-h` 子孫では無効化する Tailwind variant。横書きデフォルトに対する上書きを宣言的に書ける。

```tsx
<div className="writing-v">
  <p className="my-4 vertical:my-0">
    {/* 横書き時のみ縦マージン、縦書きでは外す */}
  </p>
</div>
```

### 注意点

- 画像・iframe などの置換要素は `vertical-rl` で大きさが想定通りにならないことがある。`<img className="vertical:writing-h" />` のように要素自体は横書きに戻す。
- `-webkit-line-clamp` (`line-clamp-*`) は Safari で `writing-mode` と干渉する。縦書きでは `block-size` 上限 + `overflow: hidden` に置き換える。
- KaTeX など内部で水平レイアウトを前提とするライブラリは、必要箇所だけ `writing-h` を上書きする。

## やってはいけないこと

- 3種類以上のフォントウェイトを1画面で使う
- `text-3xl` より大きいサイズを通常テキストに使う（`text-emphasize` / `text-highlight` は特殊用途）
- `uppercase` や `tracking-widest` を日本語テキストに適用する
- テキストにグラデーションをかける
- フォントサイズだけで階層を作る（余白も活用する）
