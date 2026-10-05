import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`@k8ordo/i18n`がどう動いているかを説明します。使うだけなら知らなくてもかまいませんが、なぜそう書くのかが分かると、迷ったときに判断しやすくなります。',
  en: 'How `@k8ordo/i18n` works underneath. None of it is needed to use the package, but knowing why it is written this way makes the edge cases easier to reason about.',
});

export const functionTitle = message({
  ja: '文言は副作用の無い関数',
  en: 'A message is a function with no side effect',
});

export const functionDescription = message({
  ja: '`message`は、受け取った文を閉じ込めた関数を返すだけです。宣言した時点では、どこにも登録せず、何も確かめず、エラーも投げません。',
  en: '`message` only returns a function holding the text it was given. At the declaration it registers nothing, checks nothing, and throws nothing.',
});

export const functionCallout = message({
  ja: 'ブラウザに届くのはこの文言だけ',
  en: 'The only message that reaches the browser',
});

export const functionBundle = message({
  ja: "そのため、どこからも呼ばれない文言は、使われないコードとしてバンドラが取り除けます。ブラウザのバンドルに入るのは、`'use client'`のモジュールと、そこからimportされたモジュールが名前で参照した文言だけです。入る文言は、すべてのロケールの文を持っています。",
  en: "So a bundler can drop a message nothing calls, as dead code. What a browser bundle carries is exactly the messages that `'use client'` modules, and the modules they import, name — each with its text in every locale.",
});

export const functionServer = message({
  ja: 'Server Componentが描いた文は、どのモジュールで宣言されていても、ブラウザのバンドルを増やしません。文言を1つの辞書オブジェクトにしないのは、このためです。辞書は、丸ごと残るか丸ごと消えるかのどちらかしかありません。',
  en: 'Text a Server Component renders adds nothing to the browser bundle, whichever module declares it. That is why messages are not entries in one dictionary object: a dictionary is kept or dropped whole.',
});

export const functionThrow = message({
  ja: 'ロケールの欠けを宣言の時点で確かめないのも、同じ理由です。宣言の中にエラーを投げるコードがあると、バンドラはその宣言を副作用とみなし、使われない文言を取り除けなくなります。そのため、型をすり抜けた欠けは、文言を読んだ時点で`TypeError`になります。',
  en: 'A missing locale is not checked at the declaration for the same reason: a declaration that could throw looks like a side effect to the bundler, which could then no longer drop unused messages. A gap that gets past the types becomes a `TypeError` where the message is read instead.',
});

export const functionNoSet = message({
  ja: '`message`がロケールの集合を引数に取らないのも、宣言を解析できる形に保つためです。仮に`locales.message(…)`のような集合のメソッドにすると、バンドラはほかの呼び出しが返した関数の中を解析しないので、使われない文言が残ってしまいます。',
  en: '`message` does not take the locale set as an argument for the same reason. Were it a method such as `locales.message(…)`, the bundler would not look inside a function another call returned, and unused messages would stay.',
});

export const functionMeasure = message({
  ja: 'ビルドのあとに`dist/client/assets/`のJavaScriptを検索すれば、Server Componentだけが描く文が入っていないことを確かめられます。',
  en: 'After a build, search the JavaScript in `dist/client/assets/` to confirm that text only a Server Component renders is not there.',
});

export const whereTitle = message({
  ja: 'ロケールを読む場所',
  en: 'Where the locale is read',
});

export const whereDescription = message({
  ja: '文言はロケールを受け取らず、呼ばれたときに自分で読みます。読む場所は、サーバーとブラウザで違います。',
  en: 'A message is never handed the locale; it reads it when called. Where it reads it differs between the server and the browser.',
});

export const serverTitle = message({
  ja: 'サーバーでは',
  en: 'On the server',
});

export const serverStorage = message({
  ja: 'サーバーでは、`paramsSchema`が受け付けたロケールを`AsyncLocalStorage`に置きます。描いている途中のリクエストが同時にいくつあっても、それぞれのロケールは混ざりません。',
  en: 'On the server, the locale `paramsSchema` accepted is kept in `AsyncLocalStorage`, so however many requests are rendering at once, their locales stay apart.',
});

export const serverBuiltin = message({
  ja: '`AsyncLocalStorage`は、`node:async_hooks`をimportせずに`process.getBuiltinModule`で取り出します。同じビルドを、ブラウザでもそのまま読み込めるようにするためです。',
  en: '`AsyncLocalStorage` is reached through `process.getBuiltinModule` rather than an import of `node:async_hooks`, so the same build loads in a browser unchanged.',
});

export const serverGlobal = message({
  ja: 'RSCの環境と、Client ComponentをHTMLにするSSRの環境は、同じプロセスの中の別のモジュールグラフです。両方が同じロケールを読めるように、ストレージは`globalThis`に置いています。',
  en: 'The RSC environment and the SSR environment, where Client Components become HTML, are separate module graphs in one process. The storage lives on `globalThis` so that both read the same locale.',
});

export const serverPattern = message({
  ja: 'ロケールを受け付けるのは、どのパターンが答えるかを決める途中です。フレームワークはパターンごとに別の流れでスキーマを走らせ、答えたパターンの流れで描画を始めます。後に続くスキーマが拒んだパターンでは、受け付けたロケールもパターンと一緒に捨てられます。',
  en: 'A locale is accepted while the framework is still deciding which pattern answers. It runs each pattern’s schemas in a flow of their own and starts the render in the flow of the pattern that answered, so a locale accepted for a pattern a later schema refused is dropped with it.',
});

export const browserTitle = message({
  ja: 'ブラウザでは',
  en: 'In the browser',
});

export const browserUrl = message({
  ja: 'ブラウザでは、`location.pathname`のうちViteの`base`より下の最初の区間を、文言を呼ぶたびに読みます。これがサーバーのHTMLと一致するのは、そのHTMLが同じURLのために描かれたからです。別のURLのために描いた`404.html`は、ハイドレーションせずに描き直します。',
  en: 'In the browser, a message reads the first segment of `location.pathname` below Vite’s `base` every time it is called. That agrees with the server’s HTML because the HTML was rendered for the same URL; a `404.html` rendered for another one is rendered afresh instead of hydrated.',
});

export const browserDetect = message({
  ja: 'どちらの読み方をするかは、モジュールを読み込んだ時点で`document`が定義されているかどうかで、1度だけ決まります。',
  en: 'Which of the two is used is decided once, when the module loads, by whether `document` is defined.',
});

export const browserBeforeSet = message({
  ja: '集合を定義するモジュールがブラウザでまだ評価されていない間は、URLの区間がロケールかどうか分かりません。その間は、文言が文を持たない区間をロケールではないとみなし、最初に書いた文を返します。`/fr/…`の404ページがエラーを投げないのは、このためです。',
  en: 'Until the module defining the set has run in the browser, there is no telling whether a segment is a locale. Meanwhile, a segment the message has no text for counts as no locale, and the first text written is used. That is why a 404 page on `/fr/…` does not throw.',
});

export const lastTitle = message({
  ja: '最後に定義した集合が使われる',
  en: 'The last set defined is the one used',
});

export const lastDescription = message({
  ja: '`defineLocales`は値を返すだけでなく、既定のロケールと、一覧に含まれるかを確かめる関数を`globalThis`に登録します。`message`は集合を受け取らないので、ここから既定のロケールを読みます。',
  en: '`defineLocales` does more than return a value: it registers the default locale and the membership check on `globalThis`. `message` takes no set, so this is where it reads the default from.',
});

export const lastWins = message({
  ja: '登録は、後から定義したほうが勝ちます。開発サーバーがロケールを足した`i18n.ts`を評価し直したとき、次に呼ばれる文言が新しい集合を読めるようにするためです。',
  en: 'The last definition wins, so that when a dev server evaluates `i18n.ts` again after a locale is added, the next message called reads the new set.',
});

export const lastPitfall = message({
  ja: 'その代わり、テストや補助関数の中で別の集合を定義すると、それ以降のすべての文言がその集合を読みます。集合はアプリに1つだけにして、1つのモジュールで定義してexportし、ほかの場所ではimportしてください。',
  en: 'The flip side: define another set inside a test or a helper, and every message after it reads that set. Keep one set per app, defined and exported from one module and imported everywhere else.',
});

export const providerTitle = message({
  ja: 'プロバイダもフックも無い理由',
  en: 'Why there is no provider and no hook',
});

export const providerDescription = message({
  ja: 'ロケールはURLにあり、文言はそれを呼ばれた場所で読みます。そのため、ロケールをコンポーネントの木に流すプロバイダも、それを読み出すフックも要りません。',
  en: 'The locale is in the URL, and a message reads it where it is called. So there is no provider to pass the locale down the tree, and no hook to read it with.',
});

export const providerServer = message({
  ja: 'プロバイダの値はClient Componentでしか読めないので、Server Componentはプロバイダからロケールを受け取れません。文言が自分でロケールを読む形なら、Server ComponentでもClient Componentでも、同じ1行で呼べます。',
  en: 'Only a Client Component can read a provider’s value, so a Server Component could not get the locale from one. A message that reads the locale itself is the same line in a Server Component and in a Client Component.',
});

export const providerAnywhere = message({
  ja: 'フックではないので、文言はイベントハンドラの中でも、ほかの文言の関数の中でも、`bindParams`に渡す関数の中でも呼べます。',
  en: 'Not being a hook, a message can be called in an event handler, inside another message’s function, or in the function handed to `bindParams`.',
});

export const providerNoState = message({
  ja: 'ロケールを変えるのは、ページの移動です。ブラウザで同期させる状態は無く、移動すればページが描き直されて、文言は新しいURLのロケールで読まれます。',
  en: 'Changing the locale is a navigation. The browser holds no state to keep in sync: the page renders again, and its messages read the new URL’s locale.',
});
