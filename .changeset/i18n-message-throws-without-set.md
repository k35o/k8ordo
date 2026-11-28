---
'@k8ordo/i18n': major
---

ロケールの集合が定義されていないところで文言を呼ぶと、`message: no locale set is defined here`のエラーになるようにしました。これまでは最初に書いた文を返していました。集合が無いとURLの区間がロケールかどうかも既定のロケールも決まらないので、`/en/…`でも`defineLocales`の`default`でもない言語を、エラーにならないまま描いていました。

`@k8ordo/framework`のアプリでは、`src/i18n.ts`がブラウザでもサーバーでも、どのルートのファイルより先に読まれるので、何も変えなくてかまいません。`currentLocale()`は今までどおり、集合が無ければ`null`を返します。

移行するには、次のように書き換えます。

- アプリのコンポーネントや文言を呼ぶVitestのテストは、`setupFiles`に挙げたファイルの先頭で`import './src/i18n';`のように集合を定義するモジュールを読み込みます。
- Storybookは、`.storybook/preview.tsx`の先頭で同じモジュールを読み込みます。
- `@k8ordo/framework`の外のアプリは、集合を定義するモジュールを、サーバーとブラウザの両方で文言より先に読み込みます。ブラウザでは、ルートが描くClient Componentからimportします。
