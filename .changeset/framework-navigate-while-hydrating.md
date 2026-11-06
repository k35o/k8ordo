---
'@k8ordo/framework': patch
---

`404.html`や`fallback.tsx`の殻のように、別のpathnameのために描いたHTMLで、hydrateを終える前に遷移すると、残りのSuspenseの境界がhydrateで食い違うのを直しました。Reactはその境界をクライアントで描き直し、回復できるエラーとして報告していました。遷移、Server Actionの答え、`vite dev`の読み直しは、HTMLのhydrateが終わるのを待ってから木を当てます。
