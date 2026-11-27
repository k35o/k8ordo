---
'@k8ordo/framework': patch
---

staticモードで、`fallback.tsx`の殻がリテラルのディレクトリに隠れるときのエラーを直しました。`ja/posts/[id]/page.tsx`が`[locale]/posts/[id]/`（`fallback.tsx`あり、`[locale]/paths.ts`が`ja`を返す）より先に宣言されると、これまでは「`fallback.tsx`の無いページ」というエラーになり、本当の原因を言っていませんでした。今は殻が先に宣言されたパターン（`ja/posts/[id]/page.tsx`）の答えるURLにも答えてしまうことを名指します。
