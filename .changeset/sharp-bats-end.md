---
"@k8ordo/ui": minor
---

日付の入力部品を追加しました。`DateField` はブラウザの `<input type="date">` をそのまま使う入力欄で、`@k8ordo/form` が `z.iso.date()` から導いた `input` を `type` を抜かずに spread できます。`Calendar` は月の表から 1 日を選ぶ WAI-ARIA の date picker grid で、月名・曜日名・週の始まりはページの言語に従い、「今日」を閲覧者のタイムゾーンで決めるためブラウザでだけ描きます。`DatePicker` は `DateField` とポップオーバーの `Calendar` の組み合わせで、カレンダーで選んだ日付は入力欄に書き込んで `input` イベントで知らせるので、フォームには打ち込んだときと同じく伝わります。3 部品とも json-render と OpenUI のカタログに載せました。
