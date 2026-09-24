---
"@k8ordo/ui": patch
---

`Tabs` の選択インジケータから、anchor positioning 未対応ブラウザ向けのフォールバック（選択中のタブに描く静的な下線）を削除しました。anchor positioning は Chrome 125・Safari 26・Firefox 147 で出そろって Baseline newly available になったため、対応ブラウザでの見た目と挙動は変わりません。
