---
'@k8ordo/framework': minor
---

`framework()`に`headers`を足しました。書いたヘッダーは、ページ、ビルドのファイル、404、リダイレクトのどの応答にも付きます。これまで全応答のヘッダーは`vercel()`のルートにしか書けず、当てるのはVercelだけだったので、`vite dev`や`vite preview`ではアプリが自分でプラグインを書いて同じ値を付けていました。今は1度書けば、`vite dev`、`vite preview`、`serve`が送り、`vercel()`がどちらのモードでもルートとして書き、staticモードのビルドがNetlifyとCloudflareの読む`dist/client/_headers`に書きます（`public/_headers`はその後ろに残ります）。serverモードではハンドラも自分の応答に足し、`guard.ts`や`route.ts`が同じ名前で書いたヘッダーはそのまま残します。扱うのは全応答に付く1組だけで、一部のパスだけのヘッダーは今までどおり`vercel()`のルートや`public/_headers`に書きます。HTTPで送れない名前や値は、設定を読んだ時点で断ります。
