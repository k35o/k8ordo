---
'@k8ordo/framework': patch
---

staticモードのビルドが、書き出すすべてのHTML（ページ、`404.html`、`fallback.tsx`の殻）について、ペイロードが名指すクライアントコンポーネントのCSSが`<head>`の`<link rel="stylesheet">`に、JSが`<link rel="modulepreload">`か`<script>`の`src`にあるかを確かめるようになりました。1つでも抜けていれば、すべてのファイルを書いたあとでビルドを止めます。エラー文は、抜けたHTMLとファイルとコンポーネントの数、報告先と版に続けて、抜けたファイルごとに、抜けたページの数と例、そのファイルが要るコンポーネントを挙げます。これまでは、抜けのあるHTMLをそのまま書き出していました。

- 抜けは`@k8ordo/framework`か、HTMLを書いたReactの不具合で、アプリケーションの側では直せません。止まったら、エラー文を添えて https://github.com/k35o/k8ordo/issues に報告してください。上げた直後に止まるようになったなら、直るまでは、上げたもの（`@k8ordo/framework`、または`react`と`react-dom`）を前の版に戻します。
- serverモードと`vite dev`では確かめません。クライアントコンポーネントが動的に読むもの（`React.lazy`）のCSSと、Server ComponentのCSSも確かめません。
