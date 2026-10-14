---
'@k8ordo/framework': patch
---

client コンポーネントが import した CSS が、SSR の HTML に `<link rel="stylesheet">` されないことがあるのを直しました。その JS の `<link rel="modulepreload">` も同じく出ないことがありました。ブラウザでの遷移を受け持つ部品は SSR でも描かれ、そのモジュールが読み込む `@vitejs/plugin-rsc/browser` が、client 参照の読み込み口をブラウザ用のものに差し替えていたためです。ブラウザ用の読み込み口はこの 2 つを出しません。どちらの読み込み口が残るかはバンドルの中の評価順で決まり、ブラウザ用が残ったアプリでは、CSS が当たるのは JS が読み込まれた後で、JS を切った訪問者には当たりませんでした。
