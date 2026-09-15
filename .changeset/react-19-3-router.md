---
'@k8ordo/router': minor
---

ページ遷移を React 19.3 の `<ViewTransition>` で animate できるようにしました（peer は `react` / `@types/react` とも `>=19.3.0`）。

- 新しい木を適用する transition に `addTransitionType` で型を付けます: `navigation` と、プラットフォームが報告した種類 `navigation-push` / `navigation-replace` / `navigation-traverse`。ページの穴を `<ViewTransition default="none" update={{ navigation: 'auto', default: 'none' }}>` で包むと、ページの差し替えだけがクロスフェードし、`Button` の action など他の transition では動きません。GUIDE に「Animating page changes」を足しました。
- intercept の handler を passive effect ではなく layout effect で resolve するようにしました。`finished` の意味（新しい木が commit された）は変わらず、描画前になります。スクロール位置も描画前に置くので、新しいページが 1 フレーム古い位置で見えることが無くなります。`<ViewTransition>` があると React は保留中の遷移が finish するまで新しいスナップショットを待ち、passive effect はアニメーション後にしか走らないので、passive のままでは互いに待ち合っていました。
