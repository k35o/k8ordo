---
"@k8ordo/ui": major
---

`Modal` と、その上に作られている `Drawer` の退場アニメーションをなくしました。閉じると、どのブラウザでもその場で消えます。開くときのフェード・拡大・スライドはこれまでどおりです。

退場のアニメーションは、閉じた `<dialog>` を 0.2 秒 top layer に留める `overlay` の transition（`transition-behavior: allow-discrete`）に頼っていました。`overlay` は Chromium にしかなく、Safari と Firefox では `@supports not (overlay: auto)` で退場を即時に切り替えていました。Baseline に入っていない機能を、対応ブラウザでだけ効く磨きとしても使わず、機能判定で分岐するコードも置かない、という方針に合わせて外します。

スタイルシートからは、`.ao-modal` の `display` と `overlay` の transition、`@supports not (overlay: auto)` の規則が消えます。`styles.css` の `.ao-modal` を上書きして退場を作っていた場合は、その上書きも見直してください。
