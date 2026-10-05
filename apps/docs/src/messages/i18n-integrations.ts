import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`@k8ordo/i18n`は、ほかのk8ordoのパッケージをimportしません。組み合わせるための数行は、アプリの側に書きます。このページでは、`@k8ordo/ui`と`@k8ordo/form`、`@k8ordo/router`、`@k8ordo/static`と`@k8ordo/server`との組み合わせ方を説明します。',
  en: '`@k8ordo/i18n` imports no other k8ordo package; the few lines that combine them are the app’s. This page covers `@k8ordo/ui`, `@k8ordo/form`, `@k8ordo/router`, and `@k8ordo/static` and `@k8ordo/server`.',
});

export const uiTitle = message({
  ja: '`@k8ordo/ui`の文言を合わせる',
  en: 'Match `@k8ordo/ui`’s wording',
});

export const uiDescription = message({
  ja: '閉じるボタンのラベルのように、`@k8ordo/ui`のコンポーネントが自分で描く文言は、`@k8ordo/i18n`の今のロケールで選ばれます。プロバイダに渡すものはありません。',
  en: 'The text `@k8ordo/ui`’s components render on their own, such as a close button’s label, follows `@k8ordo/i18n`’s current locale. Nothing is passed to a provider.',
});

export const uiBuiltIn = message({
  ja: '`ja`と`en`の文言は、`@k8ordo/ui`に入っています。ほかのロケールは、集合を定義するモジュールで`registerMessages`に登録します。',
  en: '`@k8ordo/ui` ships text for `ja` and `en`. Register any other locale with `registerMessages`, in the module that defines the set.',
});

export const uiTypes = message({
  ja: '登録する文言に`@k8ordo/ui/i18n`の`Messages`型を付けておけば、キーの漏れが型エラーになります。`fr-CA`のように地域の付いたタグは、登録が無ければ言語の`fr`の文言を読みます。',
  en: 'Annotate the registered text with the `Messages` type from `@k8ordo/ui/i18n`, and a missing key is a type error. A regional tag such as `fr-CA` without a registration of its own reads its language’s, `fr`.',
});

export const uiPitfall = message({
  ja: '集合を定義するモジュールは、ブラウザでも読み込まれている必要があります。集合が定義されていない環境では`@k8ordo/ui`は英語で描くので、サーバーのHTMLと食い違います。`bindParams`のリンクや言語の切り替えのように、Client Componentが`locales`をimportしていれば満たされます。',
  en: 'The module that defines the set has to be loaded in the browser as well. Where no set is defined, `@k8ordo/ui` speaks English and disagrees with the server’s HTML. A Client Component importing `locales`, as the `bindParams` links or a language switcher do, is enough.',
});

export const uiProps = message({
  ja: 'コンポーネントに渡すテキストは文字列なので、`<Button>{m.cart.add()}</Button>`のように、文言を呼んだ結果を渡します。',
  en: 'Text handed to a component is a string, so pass what the message returns: `<Button>{m.cart.add()}</Button>`.',
});

export const uiLink = message({
  ja: '`@k8ordo/ui`の文言のキーと登録の仕方を見る',
  en: 'See `@k8ordo/ui`’s keys and how to register them',
});

export const formTitle = message({
  ja: '`@k8ordo/form`のエラー文言を訳す',
  en: 'Translate `@k8ordo/form`’s errors',
});

export const formDescription = message({
  ja: '`@k8ordo/form`が表示するエラーの文言は、zodのエラー文言です。文言をその場で呼んで文字列にせず、関数のままzodに渡すと、エラーを報告するときのロケールで作られます。',
  en: 'The errors `@k8ordo/form` shows are zod’s messages. Hand zod the message as a function rather than the string it returns, and it is worded in the locale current when the error is reported.',
});

export const formRule = message({
  ja: "`defineForm`のルールの文言も同じです。`requiredWhen('reason', 'status', 'rejected', m.talk.reasonRequired)`のように関数のまま渡せば、ルールを報告するときに呼ばれます。",
  en: "A `defineForm` rule’s message works the same way: pass the function, as in `requiredWhen('reason', 'status', 'rejected', m.talk.reasonRequired)`, and it is called when the rule is reported.",
});

export const formFieldsPitfall = message({
  ja: '`formFields`は、モジュールのトップレベルではなく、ページの描画の中で呼びます。`formFields`は呼んだ時点でエラーの文言を作るので、トップレベルで呼ぶと、最初に読み込んだときのロケールで固定されます。',
  en: 'Call `formFields` inside the page’s render, not at the top of a module. It words the errors when it is called, so at module scope they stay in whatever locale was current when the module first loaded.',
});

export const formAction = message({
  ja: '`[locale]`のページから送ったServer Actionは、`@k8ordo/server`の下ではそのページのロケールで動きます。フレームワークが、アクションのリクエストでもページの`paramsSchema`を走らせるからです。そのため、`parseForm`が作る文言もページの言語になります。',
  en: 'A Server Action posted from a `[locale]` page runs in that page’s locale under `@k8ordo/server`, because the framework runs the page’s `paramsSchema` for the action’s request too. So the messages `parseForm` produces are in the page’s language.',
});

export const formOutside = message({
  ja: 'フレームワークの外で動くアクションやジョブで`parseForm`を呼ぶときは、`locales.run`の中で呼びます。',
  en: 'An action or a job running outside the framework calls `parseForm` inside `locales.run`.',
});

export const formLink = message({
  ja: '`@k8ordo/form`のエラーの表示の仕方を見る',
  en: 'See how `@k8ordo/form` shows errors',
});

export const routerTitle = message({
  ja: '`@k8ordo/router`で型の付いたリンクを書く',
  en: 'Write typed links with `@k8ordo/router`',
});

export const routerDescription = message({
  ja: 'ロケールは、すべてのパターンの`:locale`パラメータです。`@k8ordo/router`の`bindParams`にロケールを返す関数を1回渡すと、リンクのたびにロケールを書かずに済みます。',
  en: 'The locale is the `:locale` parameter of every pattern. Hand `@k8ordo/router`’s `bindParams` a function returning it once, and no link has to spell the locale again.',
});

export const routerSource = message({
  ja: '渡した関数は、`href`を呼ぶたびに読まれます。サーバーではそのリクエストの、ブラウザでは今のURLのロケールが入ります。上の`href`の値は、英語のページで呼んだときのものです。',
  en: 'The function is read every time `href` is called: the request’s locale on the server, the current URL’s in the browser. The `href` value above is what an English page gets.',
});

export const routerOverride = message({
  ja: 'ロケールを書けば、渡した関数より優先されます。上の`navigateTo`は、日本語のトップページへ移動します。',
  en: 'A locale written out overrides the function: the `navigateTo` above goes to the Japanese top page.',
});

export const routerTyped = message({
  ja: 'パターンは`/:locale/…`と書いたままなので、ルートの表に照らした型の検査もそのまま効きます。2つのパッケージは互いをimportせず、結んでいるのはアプリのこの1行です。',
  en: 'Patterns keep their `/:locale/…` spelling, so they are still checked against the route table. Neither package imports the other; this one line in the app is what ties them.',
});

export const routerMatch = message({
  ja: "`useMatch('/:locale/docs/*')`のように、ロケールを含むパターンのまま、いまどの区画にいるかを確かめられます。",
  en: "Which section is showing can be asked with the locale still in the pattern, as in `useMatch('/:locale/docs/*')`.",
});

export const routerLink = message({
  ja: '`@k8ordo/router`のリンクの書き方を見る',
  en: 'See how `@k8ordo/router` writes links',
});

export const frameworkTitle = message({
  ja: '`@k8ordo/static`と`@k8ordo/server`',
  en: '`@k8ordo/static` and `@k8ordo/server`',
});

export const frameworkDescription = message({
  ja: 'どちらのモードでも、`[locale]`のレイアウトがexportした`paramsSchema`をフレームワークが走らせ、受け付けたロケールでページを描きます。違うのは、書き出すpathnameの一覧と、`/`の振り分け方です。',
  en: 'In either mode the framework runs the `paramsSchema` the `[locale]` layout exports, and renders the page in the locale it accepts. What differs is the list of pathnames to write, and how `/` sends visitors on.',
});

export const frameworkList = [
  message({
    ja: '`@k8ordo/static`：`framework({ paths: locales.paths })`で、ロケールの数だけページを書き出します（「静的に書き出す」）。`/`のページは、ブラウザで交渉してから移動します（「最初の言語を選ぶ」）。',
    en: '`@k8ordo/static`: `framework({ paths: locales.paths })` writes a page per locale (“Static builds”). The `/` page negotiates in the browser and moves on (“Choose the first language”).',
  }),
  message({
    ja: '`@k8ordo/server`：リクエストごとに描くので、`paths`は要りません。`/`には、`guard.ts`が`307`で答えます（「最初の言語を選ぶ」）。Server Actionも、送ったページのロケールで動きます。',
    en: '`@k8ordo/server`: pages render per request, so there is no `paths`. A `guard.ts` answers `/` with a `307` (“Choose the first language”), and a Server Action runs in the locale of the page that posted it.',
  }),
] as const;
