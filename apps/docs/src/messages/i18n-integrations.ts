import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`@k8ordo/i18n` はほかの k8ordo パッケージを import しません。組み合わせる行はアプリケーションが書き、どれも数行で済みます。このページでは `@k8ordo/ui`・`@k8ordo/form`・`@k8ordo/router`・`@k8ordo/static`・`@k8ordo/server` との結び方と、テストの書き方を扱います。',
  en: "`@k8ordo/i18n` imports no other k8ordo package. The lines that combine them are the application's, and each takes a few lines. This page covers `@k8ordo/ui`, `@k8ordo/form`, `@k8ordo/router`, `@k8ordo/static` and `@k8ordo/server`, and how to test.",
});

export const ui = {
  title: message({
    ja: '`@k8ordo/ui`',
    en: '`@k8ordo/ui`',
  }),
  description: message({
    ja: 'コンポーネントが自前で描く文言（閉じるボタンのラベル、必須の表示、読み込み中の読み上げ）は、`@k8ordo/ui` 自身の辞書から引かれます。辞書は `UIProvider` の `messages` で渡し、`@k8ordo/ui/i18n` の `dictionaries` から描画中のロケールで選びます。',
    en: "Wording the components render on their own — close button labels, the required marker, the loading announcement — comes from `@k8ordo/ui`'s own dictionary. Pass it to `UIProvider` as `messages`, picked from `dictionaries` in `@k8ordo/ui/i18n` by the locale being rendered.",
  }),
  serializable: message({
    ja: '辞書は文字列だけのオブジェクトなので、Server Component のレイアウトから Client Component の `UIProvider` へそのまま渡せます。RSC ペイロードに入るのは選んだ 1 つの辞書だけです。',
    en: 'A dictionary is an object of strings, so a Server Component layout can pass it straight to the client `UIProvider`. Only the one dictionary chosen travels in the RSC payload.',
  }),
  otherLocales: message({
    ja: '`dictionaries` が持つのは `ja` と `en` です。集合にそれ以外のロケール（`fr` や `en-US`）があるときは、`@k8ordo/ui/i18n` の `Messages` 型を注釈した辞書を自分で用意し、ロケールから辞書への対応を `Variants<Messages>` で書くと、漏れが型で分かります。',
    en: '`dictionaries` holds `ja` and `en`. When the set has other locales (`fr`, or `en-US`), write those dictionaries yourself, annotated with the `Messages` type from `@k8ordo/ui/i18n`, and map locales to dictionaries with a `Variants<Messages>` so a missing one is a type error.',
  }),
  notFound: message({
    ja: '`not-found.tsx` の下でも上のスキーマは走るので、`getLocale()` は 404 の URL が名指すロケールになり、`/en/…` の 404 には英語の辞書が渡ります。URL がロケールを名指さなければ既定です。例外は静的ビルドの `404.html` で、番兵の区間で 1 回だけ描かれるので既定のロケールで届き、ブラウザが訪問者の URL で描き直したときに訪問者のロケールになります。辞書を Client Component の中で選べば（このサイトの `LocaleShell` のように `locales.delocalize(usePathname()).locale` から）、そこで訪問者のロケールに合います。',
    en: "The schema above `not-found.tsx` still runs, so `getLocale()` on a 404 is the locale its URL names — a 404 at `/en/…` gets the English dictionary — and the default where the URL names none. The exception is a static build's `404.html`, rendered once under a sentinel segment: it arrives in the default, and follows the visitor's locale once the browser renders it afresh at their URL. Pick the dictionary in a Client Component (from `locales.delocalize(usePathname()).locale`, as this site's `LocaleShell` does) and it follows them there.",
  }),
  props: message({
    ja: 'コンポーネントの props に渡すテキストは文字列です。`<Button>{m.form.submit()}</Button>` のように、文言を呼んだ結果を渡します。',
    en: "Text passed to a component's props is a string: call the message, as in `<Button>{m.form.submit()}</Button>`.",
  }),
  link: message({
    ja: '`@k8ordo/ui` の文言辞書のページを読む',
    en: "Read `@k8ordo/ui`'s page on its wording",
  }),
};

export const form = {
  title: message({
    ja: '`@k8ordo/form`',
    en: '`@k8ordo/form`',
  }),
  description: message({
    ja: '`@k8ordo/form` が表示する文言は zod のエラー文言です。`formFields` は導出の時点でスキーマに値を通して文字列にし、`parseForm` は検証の時点で作ります。どちらもその瞬間のロケールで作られるので、押さえる点は 3 つです。',
    en: "The messages `@k8ordo/form` shows are zod's error messages: `formFields` turns them into strings by probing the schema when it derives the fields, and `parseForm` produces them when it validates. Both are made in the locale current at that moment, which leaves three things to get right.",
  }),
  errorMap: message({
    ja: 'zod には文字列ではなく文言の関数を `error` として渡します。zod が issue を報告するときに呼ぶので、その時点のロケールの文になります。`min(1, m.talk.titleRequired())` のように宣言で呼ぶと、その時点のロケール（多くの場合は既定のロケール）の文字列で固定されます。',
    en: 'Give zod the message function as `error`, not a string. Zod calls it when it reports the issue, so the text is in the locale current then. Calling the message in the declaration, as in `min(1, m.talk.titleRequired())`, freezes the string of whatever locale was current then, usually the default.',
  }),
  derive: message({
    ja: '`formFields(schema)` は、モジュールの先頭ではなくページの描画の中で呼びます。モジュールの先頭は 1 回しか走らず、多くの場合リクエストの外なので、どのロケールのページにも同じ文言（たいていは既定のロケールのもの）が渡ります。',
    en: "Call `formFields(schema)` inside the page's render, not at module scope. Module scope runs once, usually outside any request, so every locale's page would be handed the same messages, most likely the default locale's.",
  }),
  action: message({
    ja: 'Server Action は `[locale]` の描画の外で走るので、ロケールを指名するものがありません。ページで `bind` したロケールを受け取り、`locales.run` の中で `parseForm` を呼びます。クライアントから戻ってくる値なので、`locales.is` で確かめてから使います。',
    en: 'A Server Action runs outside the `[locale]` render, so nothing names a locale there. Take the locale the page bound to the action and call `parseForm` inside `locales.run`. The value comes back from the client, so check it with `locales.is` before using it.',
  }),
  guideLink: message({
    ja: '`@k8ordo/form` のガイドを読む',
    en: "Read `@k8ordo/form`'s guide",
  }),
  staticNote: message({
    ja: 'Server Action は `@k8ordo/server` にしかありません。`@k8ordo/static` のサイトに当てはまるのは、1 つ目と 2 つ目です。',
    en: 'Server Actions exist only under `@k8ordo/server`; on an `@k8ordo/static` site, only the first two points apply.',
  }),
};

export const router = {
  title: message({
    ja: '`@k8ordo/router`',
    en: '`@k8ordo/router`',
  }),
  description: message({
    ja: 'ロケールは、すべてのパターンの `:locale` param です。ルーターに i18n のための設定はありません。',
    en: 'The locale is the `:locale` parameter of every pattern. The router has no i18n settings.',
  }),
  links: message({
    ja: 'リンクとナビゲーションは、`bindParams(() => ({ locale: locales.getLocale() }))` が返す `href` / `navigateTo` で書きます。',
    en: 'Links and navigation use the `href` / `navigateTo` that `bindParams(() => ({ locale: locales.getLocale() }))` returns.',
  }),
  switcher: message({
    ja: '言語切替は、`usePathname()` で今の pathname を読み、`delocalize` と `localize` で別のロケールの URL を作ります。',
    en: "A language switcher reads the current pathname with `usePathname()` and builds the other locale's URL with `delocalize` and `localize`.",
  }),
  match: message({
    ja: "`useMatch('/:locale/docs/*')` のように、ロケールを含むパターンのまま区画を判定できます。`:locale` は区間の値を問わず一致します。",
    en: "Section checks work on patterns that include the locale, as in `useMatch('/:locale/docs/*')`; `:locale` matches whatever the segment holds.",
  }),
  link: message({
    ja: 'リンク、言語切替、`/` の振り分けの書き方を読む',
    en: 'Read how links, the language switcher and the `/` page are written',
  }),
};

export const staticMode = {
  title: message({
    ja: '`@k8ordo/static`',
    en: '`@k8ordo/static`',
  }),
  description: message({
    ja: '静的化で i18n に関わるのは 2 点です。',
    en: 'Two things matter for i18n in a static build.',
  }),
  paths: message({
    ja: '`framework({ paths: locales.paths })` で、ロケールの区間をロケールの数だけ展開します。ほかの param があれば、同じ関数の中で展開します。',
    en: '`framework({ paths: locales.paths })` expands the locale segment once per locale; any other parameter is expanded in the same function.',
  }),
  notFound: message({
    ja: '`404.html` は番兵の区間で 1 回だけ、既定のロケールで描かれます。ブラウザはこれをハイドレーションせず（別の URL 用に描かれたものなので）、訪問者の URL で描き直します。`not-found.tsx` の文言を Client Component で描けば、そこで訪問者のロケールになります。このサイトは、`<html lang>` も描いた後に effect で `document.documentElement.lang` を直しています。',
    en: "`404.html` is rendered once under a sentinel segment, in the default locale. The browser does not hydrate it — it was rendered for another URL — but renders it afresh at the visitor's, so render the text of `not-found.tsx` in a Client Component and it comes out in the visitor's locale. This site also corrects `<html lang>` from an effect once it has rendered, through `document.documentElement.lang`.",
  }),
};

export const server = {
  title: message({
    ja: '`@k8ordo/server`',
    en: '`@k8ordo/server`',
  }),
  description: message({
    ja: 'リクエストごとに描くので、`paramsSchema` と文言の働きは静的化と同じです。違うのは、ページがリクエストを読めることと、Server Action があることです。',
    en: 'Rendering happens per request, so `paramsSchema` and messages work exactly as in a static build. What differs is that a page can read the request, and that there are Server Actions.',
  }),
  negotiate: message({
    ja: 'ページは `request` を受け取るので、`/` で `Accept-Language` から交渉できます。答えを HTML に入れておけば、JavaScript の無い訪問者にも行き先のリンクが見えます。',
    en: 'A page receives `request`, so `/` can negotiate from `Accept-Language`. With the answer in the HTML, a visitor without JavaScript also sees the link to follow.',
  }),
  noRedirect: message({
    ja: 'ページ自身はリダイレクトで応答できません。`redirect()` は Server Action のためのもので、`redirect.ts` の行き先は params から作られ、リクエストのヘッダーでは変わりません。サーバーで `307` を返したいときは、アプリケーションの外で行います。`serve` の前に置いたプロキシか、ビルドされたハンドラ（`dist/rsc/index.js`）を包む自前のホストが、ハンドラを呼ぶ前に `/` だけを答えます。そうしないなら、移動はクライアントで行います。',
    en: 'The page cannot answer with a redirect itself: `redirect()` is for Server Actions, and a `redirect.ts` builds its target from the params, never from the request headers. To answer `/` with a `307` on the server, do it outside the application: a proxy in front of `serve`, or a host of your own around the built handler (`dist/rsc/index.js`), answers `/` before calling the handler. Otherwise the move happens on the client.',
  }),
  deployLink: message({
    ja: '`@k8ordo/server` のハンドラの動かし方を読む',
    en: "Read how `@k8ordo/server`'s handler is run",
  }),
  actions: message({
    ja: 'Server Action の中で文言を使うときは、上の `@k8ordo/form` の例のように `locales.run` で囲みます。',
    en: 'Wrap message calls in a Server Action with `locales.run`, as in the `@k8ordo/form` example above.',
  }),
};

export const testing = {
  title: message({
    ja: 'テスト',
    en: 'Testing',
  }),
  description: message({
    ja: 'テストでロケールを決める方法は、テストがサーバーとブラウザのどちらの経路で走るかで変わります。',
    en: 'How a test sets the locale depends on whether it runs on the server path or the browser path.',
  }),
  nodeTitle: message({
    ja: 'Node で走るテスト',
    en: 'Tests that run under Node',
  }),
  nodeDescription: message({
    ja: '何も指名しなければ、文言は既定のロケールで返ります。別のロケールは `locales.run` の中で呼びます。async の関数を渡せば `await` をまたいで保たれ、並行に走る `run` 同士は混ざりません。',
    en: 'With nothing named, messages return the default locale. Call them inside `locales.run` for another locale. An async function keeps the locale across its awaits, and concurrent `run` calls stay apart.',
  }),
  nodeSchema: message({
    ja: '`paramsSchema` で検証すると、受理したロケールが、それを呼んだ非同期の流れの残り全体に設定されます。スキーマを検証するテストは `run` で囲み、後に続くテストへ漏れないようにします。',
    en: 'Validating with `paramsSchema` sets the accepted locale for the rest of the async flow that called it. Wrap a test that validates in `run` so the locale does not leak into the tests after it.',
  }),
  browserTitle: message({
    ja: 'ブラウザで走るテスト',
    en: 'Tests that run in a browser',
  }),
  browserDescription: message({
    ja: 'Vitest のブラウザモードのような本物のブラウザでは、URL がロケールです。`history.replaceState` で pathname を変え、終わったら元に戻します。`run` は throw します。',
    en: "In a real browser, such as Vitest's browser mode, the URL is the locale. Change the pathname with `history.replaceState` and put it back afterwards. `run` throws there.",
  }),
  dom: message({
    ja: 'jsdom や happy-dom のように `document` を定義する環境も、このパッケージにとってはブラウザです。`run` は throw し、ロケールは `location.pathname` から読まれます。',
    en: 'An environment that defines `document`, such as jsdom or happy-dom, is a browser as far as this package is concerned: `run` throws, and the locale is read from `location.pathname`.',
  }),
  setTitle: message({
    ja: '集合と型',
    en: 'The set, and types',
  }),
  otherSet: message({
    ja: 'テストの中で別の集合を `defineLocales` すると、それ以降の文言はその集合を読みます。アプリケーションの `locales` を import して使うか、別の集合を作るテストがあるなら、`beforeEach` でアプリケーションの集合を定義し直します。',
    en: "Defining another set with `defineLocales` in a test makes the messages after it read that set. Import the application's `locales`, or, if some test defines its own set, define the application's set again in `beforeEach`.",
  }),
  typeTests: message({
    ja: '型の保証は、型のテストで固定できます。`expectTypeOf(cart.items).parameters.toEqualTypeOf<[count: number]>()` で引数を、ロケールを欠いた宣言に付けた `// @ts-expect-error` で、欠けがコンパイルエラーになることを確かめます。',
    en: 'Pin the type guarantees with type tests: `expectTypeOf(cart.items).parameters.toEqualTypeOf<[count: number]>()` for the arguments, and a `// @ts-expect-error` on a declaration missing a locale to prove that it does not compile.',
  }),
};
