---
"@k8ordo/ui": patch
---

`Checkbox`・`Radio`・`Switch`・`Slider`・`RangeSlider`・`Select` は、フォームの送信中に `disabled` ではなく `aria-disabled` になります。Enter で送ると、Chromium と WebKit がフォーカスを body へ落としていました。送信中は値を変える操作（クリック、値を動かすキー、`Slider`・`RangeSlider`・`Select` ではポインタも）を受け付けません。
