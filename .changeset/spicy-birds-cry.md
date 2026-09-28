---
"@k8ordo/state": minor
---

`defineCookieState(key, schema)` を追加。サーバーが読める好みの置き場所です。

- 値は `k8ordo-state.<key>`（定義の `cookieName`）という 1 つの Cookie に、宣言したフィールドの JSON をパーセントエンコードして置きます。キーが HTTP の token にならない文字を含むと定義時に throw します。
- サーバーでは `parseCookies(request.cookies)` がフィールドごとにサルベージした値を返し、それを `useAppState(def, { initialCookie })` に渡すと、サーバーの描画とハイドレーションの描画が実際の値になり、既定値がちらつきません。`@k8ordo/static` ではリクエストが無いので、local と同じく既定値で描いて hydration で置き換えます。
- ブラウザは Cookie Store API で `Path=/`・`SameSite=Lax`・`Max-Age` 400 日で書き、`change` イベントでほかのタブ（とサーバーの応答が設定した Cookie）を取り込みます。`Lax` にするのは、ほかのサイトのリンクから来た最初のリクエストにも Cookie を付けるためです。読み取りは `useSyncExternalStore` が同期のスナップショットを要るので `document.cookie` で行います。
- Cookie Store API の書き込みは非同期なので、書き込みを 1 本ずつ流し、前の書き込みが Cookie に入ってから次の書き込みの値を組み立てます。`await` を挟んだ 2 つのバッチで、後のバッチが前のバッチのフィールドを古い値で上書きすることがありません。自分の書き込みが終わる前に届いた `change` では読み直さず、最後の書き込みが終わってから読むので、echo が一瞬前の値に戻ることもありません。
- 4 KB を超えるなど Cookie Store API が拒んだ書き込みは、ハンドルを reject し、描画された値は残します（local と同じ）。
- `cookieValue(values)` は、サーバーが同じ Cookie を書くときの値を返します。ブラウザが書く Cookie なので `HttpOnly` にはできず、秘密を置く場所ではないことを GUIDE に書きました。
