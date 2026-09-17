import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '文言は `message()` で 1 つずつ宣言する関数です。全ロケールの文をその場に並べ、呼ばれた場所のロケールで文字列を返します。キーの一覧も辞書オブジェクトも無く、欠けの検査は TypeScript が、ブラウザに届ける分の選別はバンドラが受け持ちます。',
  en: 'A message is a function declared on its own with `message()`. Its text in every locale sits side by side, and it returns the string for the locale where it is called. There is no key list and no dictionary object: TypeScript checks that nothing is missing, and the bundler decides what reaches the browser.',
});

export const text = {
  title: message({
    ja: '文だけの文言',
    en: 'Text messages',
  }),
  description: message({
    ja: 'ロケールをキーに、そのロケールの文を値に書きます。戻り値は引数を取らない関数（`Message`）で、呼ぶたびにその時点のロケールを読みます。',
    en: 'Key the text by locale. What comes back is a function of no arguments (`Message`), which reads the current locale each time it is called.',
  }),
  fallback: message({
    ja: '何もロケールを指名していないとき（リクエストの外で呼んだサーバー、ロケールの区間が無い URL）は、既定のロケールの文を返します。集合がまだ登録されていない環境では、最初に書いた文を返します。',
    en: "When nothing names a locale — a call on the server outside any request, a URL without a locale segment — it returns the default locale's text. In an environment where no set has registered yet, it returns the first text written.",
  }),
};

export const values = {
  title: message({
    ja: '値を取る文言',
    en: 'Messages that take values',
  }),
  description: message({
    ja: '値を埋め込む文言は、全ロケールを同じ引数の関数で書きます。どれか 1 つに引数の型を注釈すれば、残りはその型に縛られます。',
    en: 'A message that embeds values is a function of the same parameters in every locale. Annotate the parameter types on one of them and the rest are held to those types.',
  }),
  grammar: message({
    ja: '覚える記法はありません。埋め込みはテンプレートリテラル、複数形は `Intl.PluralRules`、日付と数値は `Intl.DateTimeFormat` と `Intl.NumberFormat` です。各ロケールの関数はどのロケールの文かが決まっているので、`Intl` に渡すタグもその場に直接書けます。',
    en: "There is no syntax to learn. Interpolation is a template literal, plurals are `Intl.PluralRules`, and dates and numbers are `Intl.DateTimeFormat` and `Intl.NumberFormat`. Each locale's function is already tied to its locale, so the tag handed to `Intl` is written right there.",
  }),
  why: message({
    ja: '文言が普通の関数なので、呼ぶ側の引数は TypeScript がそのまま検査し、文を解釈するパーサーをバンドルに積む必要もありません。',
    en: 'Because a message is an ordinary function, TypeScript checks the arguments at every call site, and no parser for a message syntax has to ship in the bundle.',
  }),
  annotate: message({
    ja: 'どのロケールにも注釈を書かないと、引数の型は `unknown` と推論され、どんな値でも通ってしまいます。少なくとも 1 つには注釈を書いてください。',
    en: 'If no locale annotates its parameters, they are inferred as `unknown`, so any value passes for each argument. Annotate at least one.',
  }),
  noMix: message({
    ja: "1 つの文言の中で文と関数は混ぜられないので、値を使わないロケールも関数で書きます。そこでも引数を宣言してください（`en: (_count) => 'Items'`）。引数の無い関数は、どのロケールに置いたかによって、文言の引数が空と推論されてコンパイルエラーになるか、検査をすり抜けます。",
    en: "Text and functions cannot be mixed within one message, so a locale that does not use the value is still a function. Declare the parameter there too (`en: (_count) => 'Items'`): depending on which locale holds it, a function with no parameters either makes TypeScript infer that the message takes none, so the declaration fails to compile, or slips past the check unnoticed.",
  }),
  timeZone: message({
    ja: '日付の書式化には `timeZone` を明示してください。指定しないと、サーバーは自分のタイムゾーンで、ブラウザは訪問者のタイムゾーンで書式化するので、Client Component が描く文が HTML とハイドレーションで食い違うことがあります。',
    en: "Give a date formatter an explicit `timeZone`. Without one, the server formats in its own time zone and the browser in the visitor's, so text a Client Component renders can differ between the HTML and hydration.",
  }),
};

export const types = {
  title: message({
    ja: '`Message` と `Variants`',
    en: '`Message` and `Variants`',
  }),
  description: message({
    ja: '`message()` の戻り値は `Message<Args>` です。文だけの文言は `Message`（`() => string`）、値を取る文言は `Message<[count: number]>` のように引数の組を持ちます。',
    en: 'What `message()` returns is a `Message<Args>`: a text message is a `Message` (`() => string`), and a message that takes values carries its parameter tuple, as in `Message<[count: number]>`.',
  }),
  props: message({
    ja: 'テキストを受け取るコンポーネントやデータは、文字列ではなく `Message` を持ち、描くコンポーネントがそれを呼びます。文字列にするのは描く側だけなので、データを組み立てる側はロケールを知る必要がありません。このサイトのナビゲーションのデータも `label: Message` を持っています。',
    en: "A component or a piece of data that carries text holds a `Message`, not a string, and the component that renders it calls it. Only the renderer turns it into a string, so whatever builds the data never needs to know the locale. This site's navigation data holds `label: Message` the same way.",
  }),
  variants: message({
    ja: '`Variants<V>` は「`Register` に載せたロケールごとに 1 つの値」を表す型（`Readonly<Record<RegisteredLocale, V>>`）です。文言以外でも、ロケールごとの値が漏れなく揃っていてほしいもの、たとえば言語切替に並べる言語名に使えます。`RegisteredLocale` は、`Register` にロケールを載せた後はロケールの和集合、載せる前は `string` です。',
    en: '`Variants<V>` is the type of one value per registered locale (`Readonly<Record<RegisteredLocale, V>>`). It also fits values other than messages that must exist for every locale, such as the language names a switcher lists. `RegisteredLocale` is the locale union once `Register` is merged, and `string` before.',
  }),
};

export const checks = {
  title: message({
    ja: 'コンパイラが検査すること',
    en: 'What the compiler checks',
  }),
  description: message({
    ja: '`Register` にロケールを載せた後は、次の書き方はどれもコンパイルが通りません。',
    en: 'Once `Register` is merged, none of these compile.',
  }),
  codeColumn: message({
    ja: '書き方',
    en: 'Code',
  }),
  reasonColumn: message({
    ja: '理由',
    en: 'Why',
  }),
  missing: message({
    ja: 'ロケールが欠けている',
    en: 'A locale is missing',
  }),
  extra: message({
    ja: '集合に無いロケールがある',
    en: 'A locale outside the set',
  }),
  mixed: message({
    ja: '文と関数が混ざっている',
    en: 'Text and a function mixed',
  }),
  parameters: message({
    ja: 'ロケールごとに引数の型が違う',
    en: 'The parameters differ between locales',
  }),
  textArgument: message({
    ja: '文だけの文言に引数を渡している',
    en: 'An argument passed to a text message',
  }),
  wrongArgument: message({
    ja: '引数の型が違う',
    en: 'An argument of the wrong type',
  }),
  diagnostic: message({
    ja: 'ロケールの欠けや混在は、`message(` の呼び出しに「No overload matches this call」として報告されます。TypeScript は最後のオーバーロード（関数の文言）に対する詳細を添えるので、文だけの文言でロケールが欠けていても、詳細は「`string` を関数に代入できない」という文面になります。直すべきは欠けたキーです。',
    en: 'A missing or mixed locale is reported at the `message(` call as "No overload matches this call". TypeScript attaches the detail for the last overload — the function form — so even for a text message with a locale missing, the detail says a `string` is not assignable to a function. What needs fixing is the missing key.',
  }),
  beforeRegister: message({
    ja: '`Register` にロケールを載せる前は `RegisteredLocale` が `string` なので、ロケールの欠けは検査されません。',
    en: 'Before `Register` is merged, `RegisteredLocale` is `string`, so missing locales are not checked.',
  }),
  runtime: message({
    ja: '型を通り抜けた欠け（JavaScript からの呼び出しや `as`）は、宣言ではなく読まれた時点で `TypeError` になります（`message: no text for "en" in ["ja"]`）。宣言の時点で検査して throw すると、宣言がバンドラに副作用と見なされ、使われない文言を落とせなくなるからです。',
    en: 'A missing locale that gets past the types (a call from JavaScript, or `as`) becomes a `TypeError` where the message is read, not where it is declared (`message: no text for "en" in ["ja"]`). Checking and throwing at the declaration would make it a side effect in the bundler\'s eyes, and unused messages could no longer be dropped.',
  }),
};

export const renderTime = {
  title: message({
    ja: '描く場所で呼ぶ',
    en: 'Call it where the text is rendered',
  }),
  description: message({
    ja: '文言は呼ばれた瞬間のロケールを読みます。モジュールの先頭で呼ぶと、文字列はモジュールが最初に評価されたときに 1 回だけ作られ、どのページでもそれが使われ続けます。サーバーでは多くの場合リクエストの外なので既定のロケールの文字列になり、リクエストの途中で初めて読み込まれたモジュールなら、そのリクエストのロケールの文字列になります。ブラウザでは、読み込んだ時点の URL のロケールのまま、言語を切り替えた後も変わりません。',
    en: "A message reads the locale at the moment it is called. Called at the top of a module, it makes its string once, when the module is first evaluated, and every page keeps using that string. On the server that is usually outside any request, so it is the default locale's string; a module first loaded during a request gets that request's locale instead. In the browser it stays in the locale of the URL the module loaded under, even after a language switch.",
  }),
  frozenTitle: message({
    ja: 'モジュールの先頭で呼んだ場合',
    en: 'Called at module scope',
  }),
  keptTitle: message({
    ja: '`Message` のまま持ち、描くときに呼ぶ',
    en: 'Keep the `Message`, call it when rendering',
  }),
  other: message({
    ja: '同じことは、スキーマのエラー文言にも `getLocale()` にも当てはまります。値を先に作らず、関数を渡しておき、使う場所で呼んでください。',
    en: 'The same holds for the error messages of a schema and for `getLocale()`: do not compute the value ahead of time; hand the function along and call it where it is used.',
  }),
  formLink: message({
    ja: '`@k8ordo/form` のエラー文言での例を読む',
    en: 'Read the example with `@k8ordo/form` error messages',
  }),
};

export const where = {
  title: message({
    ja: '文言の置き場所',
    en: 'Where messages live',
  }),
  description: message({
    ja: 'どこに置いてもかまいません。読みやすいのは、領域ごとに 1 ファイルにまとめ、索引のモジュールから名前空間として再 export する形です。呼ぶ側は `m.nav.home()` と読めます。',
    en: 'Anywhere. What reads well is one file per area, re-exported as a namespace from an index module, so a call site reads `m.nav.home()`.',
  }),
  reserved: message({
    ja: '`static` のような予約語を名前空間にしたいときは、文字列の export 名（ES2022）で出します。使う側は `m.static.title()` のようにプロパティとして読めます。',
    en: 'To name a namespace with a reserved word such as `static`, export it under a string name (ES2022). The call site still reads it as a property, as in `m.static.title()`.',
  }),
  groups: message({
    ja: '1 つのコンポーネントだけが使う文言は、そのコンポーネントの隣に置いてもかまいません。関係の深い文言をオブジェクトにまとめる（`export const dialog = { title: message(…), close: message(…) }`）こともできます。その場合、バンドラはオブジェクトを丸ごと残します。',
    en: 'A message only one component uses can sit next to that component. Related messages can be grouped in an object (`export const dialog = { title: message(…), close: message(…) }`); the bundler then keeps the object whole.',
  }),
  site: message({
    ja: 'このサイトは、`src/messages/` に領域ごとのファイルを置き（`nav.ts`、`home.ts`、ガイドのページごとの `i18n-messages.ts` など）、`index.ts` がすべてを名前空間として再 export しています。3 階層になるキーは、`m.components.button.description` のようにグループのオブジェクトにしています。',
    en: 'This site keeps one file per area under `src/messages/` (`nav.ts`, `home.ts`, one file per guide page such as `i18n-messages.ts`), and `index.ts` re-exports each as a namespace. A key that would have three levels is a group object, as in `m.components.button.description`.',
  }),
};

export const boundary = {
  title: message({
    ja: 'Server Component の境界を越える',
    en: 'Across the Server Component boundary',
  }),
  description: message({
    ja: '文言は関数で、関数は Server Component から Client Component へ props として渡せません。渡そうとすると、React が関数をシリアライズできず、描画が失敗します。',
    en: 'A message is a function, and a function cannot be passed from a Server Component to a Client Component as a prop. Try it and the render fails, because React cannot serialize the function.',
  }),
  stringTitle: message({
    ja: '呼んだ結果の文字列を渡す',
    en: 'Pass the string',
  }),
  stringDescription: message({
    ja: 'Server Component が呼び、文字列を props で渡します。文字列はその描画のロケールで作られ、RSC ペイロードに入るのはそのロケールの文だけです。文言そのものはクライアントのバンドルに入りません。',
    en: "The Server Component calls the message and passes the string. The string is made in the locale of that render, and only that locale's text travels in the RSC payload. The message itself stays out of the client bundle.",
  }),
  importTitle: message({
    ja: 'Client Component 自身が import して呼ぶ',
    en: 'Or import it in the Client Component',
  }),
  importDescription: message({
    ja: '文字列を何段も受け渡す必要はありません。Client Component も文言を import して自分で呼べます。その代わり、その文言は全ロケール分がクライアントのバンドルに入ります。ブラウザで文が変わる必要がある（入力に応じて変わる、ハイドレーションの後に呼ぶ）なら import し、サーバーで決まる文なら文字列で渡す、が目安です。',
    en: 'There is no need to thread strings down several levels: a Client Component can import a message and call it itself. In exchange, that message ships to the client in every locale. As a rule of thumb, import it when the text has to change in the browser (it depends on input, or is called after hydration), and pass the string when the server already knows it.',
  }),
  sharedTitle: message({
    ja: 'ディレクティブの無いコンポーネント',
    en: 'Components without a directive',
  }),
  sharedDescription: message({
    ja: "ディレクティブの無いコンポーネントは共有コンポーネントです。Server Component から描かれればサーバーで、Client Component から描かれればブラウザで動き、どちらでも `Message` の props は境界を越えません。props と文言を読むだけのコンポーネント（ページタイトル、ランディングの枠）は、この理由で `'use client'` を付けずにおくのが適しています。このサイトの `PageTitle` と、このガイドのページを組む `DocPage` もそう書かれています。",
    en: "A component without a directive is shared: rendered by a Server Component it runs on the server, rendered by a Client Component it runs in the browser, and either way a `Message` prop never crosses the boundary. A component that only reads props and messages — a page title, a landing layout — is best left without `'use client'` for exactly this reason. This site's `PageTitle`, and the `DocPage` that lays out this guide, are written that way.",
  }),
};

export const bundle = {
  title: message({
    ja: 'ブラウザに届くもの',
    en: 'What reaches the browser',
  }),
  description: message({
    ja: '`message()` は宣言の時点で何もしません。関数を返すだけで、グローバルな状態にも触れません。だからバンドラは、どこからも参照されない文言を不要なコードとして落とせます。',
    en: '`message()` does nothing at the declaration: it returns a function and touches no global state. So a bundler treats a message that nothing references as dead code.',
  }),
  client: message({
    ja: "クライアントのバンドルに入るのは、`'use client'` のモジュール（とそこから import されるモジュール）が名前で参照した文言だけで、その文言は全ロケール分です。",
    en: "The client bundle carries exactly the messages that `'use client'` modules — and the modules they import — name, each in every locale.",
  }),
  server: message({
    ja: 'Server Component が描いた文は、どのモジュールで宣言されていても、クライアントの負担になりません。',
    en: 'Text a Server Component rendered costs the client nothing, whichever module declares it.',
  }),
  dictionary: message({
    ja: '文言を 1 つの辞書オブジェクトにしないのはこのためです。辞書は丸ごと残るか、丸ごと消えるかしかありません。',
    en: 'This is why messages are exports rather than entries in one dictionary object: a dictionary is kept or dropped whole.',
  }),
  measure: message({
    ja: 'ビルドの後、Server Component でしか描かない文を `dist/client/assets/` の JavaScript から検索すれば、クライアントに届いていないことを確かめられます。',
    en: 'After a build, search the JavaScript in `dist/client/assets/` for text only a Server Component renders to confirm that it never reached the client.',
  }),
};
