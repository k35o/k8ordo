---
'@k8ordo/framework': patch
---

ブラウザの入口が、何かを描く前にアプリの`src/i18n.ts`を読むようにしました。どのclientコンポーネントもロケールの集合をimportしていないアプリでも、ブラウザの文言と`currentLocale()`が集合を知った状態で読まれます。`src/i18n.ts`の無いアプリでは何も読みません。
