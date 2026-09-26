---
"@k8ordo/ui": minor
---

手順の段を並べる `Stepper` を追加しました。`<ol>` で段を並べ、済んだ段はチェックと読み上げ専用の「完了」（`stepperComplete`）で、いまの段は `aria-current="step"` で示します。`interactive` を付けると済んだ段がボタンになり、押すとその位置が `onChange` に届きます（先の段へは飛べません）。json-render と OpenUI のカタログにも表示専用として載せました。
