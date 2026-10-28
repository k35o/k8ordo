---
'@k8ordo/framework': patch
---

staticモードのビルドが、書き出すすべてのHTML（ページ、`404.html`、`fallback.tsx`の殻）について、ペイロードが名指すクライアントコンポーネントのCSSが`<head>`の`<link rel="stylesheet">`に、JSが`<link rel="modulepreload">`か`<script>`の`src`にあるかを確かめるようになりました。1つでも抜けていれば、すべてのファイルを書いたあとでビルドを止めます。エラー文は、抜けたHTMLとファイルとコンポーネントの数、報告先と版に続けて、抜けたファイルごとに、抜けたページの数と例、そのファイルが要るコンポーネントを挙げます。これまでは、抜けのあるHTMLをそのまま書き出していました。

- 抜けは`@k8ordo/framework`か、HTMLを書いたReactの不具合です。止まったら、エラー文を添えて https://github.com/k35o/k8ordo/issues に報告してください。上げた直後に止まるようになったなら、直るまでは、上げたもの（`@k8ordo/framework`、または`react`と`react-dom`）を前の版に戻します。
- この版では、propsの`Map`、`Set`、Promise、イテレーター、非同期イテラブル、`ReadableStream`に入れただけで描かない要素があると止まります。その要素のCSSとJSは、ビルドでそのモジュールを最初に読んだページにしか書かれないので、ほかのページで止まります。どのページが最初に読むかは描く順で決まるので、ページを足したり消したりしただけで、止まるページが変わります。`not-found.tsx`がpropsで渡すPromiseが`404.html`を描き終えたあとで解けるときも、その中の要素の分が書かれず、`404.html`で止まります。直るまでは、その要素を配列か素のオブジェクトに入れて渡すか、ページで描いてください。`not-found.tsx`では、Promiseを渡さずに値を待ってから要素を描きます。
- serverモードと`vite dev`では確かめません。クライアントコンポーネントが動的に読むもの（`React.lazy`）のCSSと、Server ComponentのCSSも確かめません。
