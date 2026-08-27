---
name: ui-design
description: |
  k8ordo UI デザインシステムに従ったフロントエンドUI作成。
  「柔らかな余白と静かな洗練」を原則とするミニマルなデザイン。

  Use when:
  - k8ordo UI を使った React コンポーネントやページを作成するとき
  - k8o の Web サイト用の UI を実装するとき
  - ミニマルで統一感のあるインターフェースが必要なとき

  特徴: Teal/Cyan カラー（OKLCH）、控えめなアニメーション、ゆったりした余白、柔らかい角丸、日本語最適化
---

# k8ordo UI Design Skill

デザインの中身はライブラリが npm で配っている `docs/` が唯一の正本。このスキルは
その正本へ橋渡しするだけで、指針そのものは持たない。

## 手順

1. **まず読む**: `packages/ui/docs/GUIDE.md`
   （このリポジトリの外なら `node_modules/@k8ordo/ui/docs/GUIDE.md`）
2. GUIDE.md 末尾の「詳細リファレンス」から、**いま必要なものだけ**辿る。
   トークン値・コンポーネントの props・hooks・生成 UI はすべてそこにある。
3. 迷ったら GUIDE.md の「アンチパターン: 『AI スロップ』を避ける」に照らす。

## このスキルが足すもの

- **既存コンポーネントを先に探す**: 自前で `div` を組む前に `references/components.md`
  の一覧を引く。無いと判断する前に必ず一覧を見る。
- **生の値を書かない**: 色・間隔・角丸・フォントウェイトはセマンティックトークン経由。
  `bg-teal-500` や `font-semibold` のような非トークン値は使わない。
- **確認は Storybook で**: 実物の挙動は
  <https://main--687a213c85e2e4589d8db1bb.chromatic.com>（MCP エンドポイントは同 URL の
  `/mcp`）から引ける。記憶で props を書かない。
