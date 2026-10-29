---
'@k8ordo/framework': minor
---

クライアントのビルドが、どのページも読むものを2つのファイルにまとめるようになりました。入口（React、ルーター、フレームワーク）と、すべての`layout.tsx`、`error.tsx`、`loading.tsx`のクライアントコンポーネントとフレームワークの境界、そしてそれらがimportするものです。これまでは、入口やレイアウトとページが分け合うモジュールが増えるたびに、どのページも読む小さなファイルが増えていました。ページどうしだけが分け合うものは、これまでどおり別のファイルで、それを描くページだけが読みます。

- そのために、クライアントの環境の`build.rolldownOptions.output.codeSplitting`をフレームワークが決めます。アプリケーションがクライアントの環境に書いた`manualChunks`は効かなくなり、`codeSplitting: false`も上書きされます。アプリケーションの`codeSplitting`の`groups`は、`priority`を`2`より大きくしたときだけ、入口とレイアウトの分のモジュールを取れます。
- `vite`のpeerを`>=8.1.0`に上げました。Rolldownの`codeSplitting`のタグ（`$initial`）を使うためです。
