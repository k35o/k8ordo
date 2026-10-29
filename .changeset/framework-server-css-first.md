---
'@k8ordo/framework': patch
---

`<head>`のCSSの順を、Server ComponentのCSSが先、クライアントコンポーネントのCSSが後に戻し、開き方によらずこの順にしました。1.2.1から、staticモードで文書として開いたページだけ、クライアントコンポーネントのCSSがServer ComponentのCSS（ルートの`layout.tsx`がimportするCSSも）より前に並んでいました。ページ遷移で移ったとき、serverモードでシェルのあとに流れる部分、`vite dev`ではもとから後ろに並ぶので、同じページでも開き方で同じ詳細度の規則の勝ち負けが入れ替わり、ルートのCSSで宣言したカスケードレイヤーの順が効かないことがありました。

- Server ComponentのCSSの先頭は、ルートの`layout.tsx`のCSSです。そこで`@layer`の順を宣言すれば、どのファイルにも効きます。
- staticモードで文書として開いたページで、同じ詳細度でクライアントコンポーネントの規則を上書きしていたServer ComponentのCSSは、遷移で移ったときと同じく負けるようになります。
- 順を決めるため、`<head>`に中身の無い`<style>`を1つ書きます。staticモードで`csp`を渡したときは、ポリシーがその`<style>`を止めるときだけ、ハッシュ（`'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='`）を足します。足す先は`style-src-elem`か`style-src`で、`default-src`しか無ければ`style-src`を作ります。`'unsafe-inline'`で許しているポリシーには足しません。
- serverモードでは、その`<style>`に応答のnonceを付けます。そのためにReactにスタイルのnonceを渡すので、`href`と`precedence`を持つ`<style>`は、同じnonceを付けたものだけがHTMLに書かれるようになります。Server Componentで描くものには`nonce={nonce()}`を渡してください。スタイルを制限するポリシーでは、`style-src`にもnonceを書きます。
- 一度読んだCSSは外さないことと、リンクの先読みでも移る先のクライアントコンポーネントのCSSを読むことを、ドキュメントに書きました。
