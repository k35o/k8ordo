---
'@k8ordo/framework': minor
---

`.mdx`のファイルがimportしたCSSが、そのファイルを描くページのHTMLに載るようにしました。RSCのプラグインは、CSSをimportするモジュールがexportした部品を包んでページにスタイルシートを載せますが、包むのはファイル名が`.js`・`.jsx`・`.ts`・`.tsx`のモジュールだけです。アプリのプラグインがコンパイルした`.mdx`は名前で外れるので、これまではimportのすべてに`?vite-rsc-css-export=default`を付ける必要があり、付け忘れるとスタイルの無いページが黙って書き出されていました。今は、CSSを静的にimportする`.mdx`（と`.md`）にframeworkが同じ変換を当てます。クエリは要りません。付けたままでも、これまでどおり動きます。MDXのコンパイラは、今までどおりアプリが`enforce: 'pre'`でViteのプラグインに足します。docsのRoutingにMDXの節を足しました。
