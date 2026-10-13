import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`@k8ordo/i18n`がロケールの読み取りをいつ、どこで行うかと、保証することとしないことが分かります。',
  en: 'When and where `@k8ordo/i18n` reads the locale, and what it does and does not guarantee.',
});

export const whereTitle = message({
  ja: 'ロケールを読む場所',
  en: 'Where the locale is read',
});

export const whereIntro = message({
  ja: '文言はロケールを引数やプロバイダから受け取らず、呼ばれたときに自分で読みます。読む場所はサーバーとブラウザで違います。どちらで動いているかは、モジュールを読み込んだ時点で`document`が定義されているかで1度だけ決まります。',
  en: 'A message is handed the locale neither as an argument nor by a provider; it reads it when called. Where it reads from differs between the server and the browser, and which side it is on is decided once, when the module loads, by whether `document` is defined.',
});

export const serverTitle = message({
  ja: 'サーバー',
  en: 'Server',
});

export const serverStorage = message({
  ja: 'サーバーでは、`run`に渡したロケールと`paramsSchema`が受け付けたロケールを`AsyncLocalStorage`に置きます。同時に描画しているリクエストがいくつあっても、ロケールは混ざりません。`AsyncLocalStorage`は`process.getBuiltinModule`で取り出し、`node:async_hooks`はimportしません。そのため、同じビルドをブラウザでもそのまま読み込めます。',
  en: 'On the server, the locale passed to `run` and the locale `paramsSchema` accepted are kept in `AsyncLocalStorage`, so concurrent renders never mix their locales. `AsyncLocalStorage` is reached through `process.getBuiltinModule`, with no import of `node:async_hooks`. So the same build loads in a browser unchanged.',
});

export const serverGlobal = message({
  ja: 'RSCの環境と、Client ComponentをHTMLにするSSRの環境は、同じプロセスの中の別のモジュールグラフです。両方が同じロケールを読めるように、ストレージは`globalThis`に置きます。',
  en: 'The RSC environment and the SSR environment, where Client Components become HTML, are separate module graphs in one process. The storage lives on `globalThis` so that both read the same locale.',
});

export const serverScope = message({
  ja: '`run`は、`fn`とそこから始まる処理だけにロケールを設定します。`paramsSchema`は、検証を呼んだ非同期コンテキストの残り全体に設定します。どの描画がそのコンテキストで動くかは、スキーマを走らせる側が決めます。`@k8ordo/framework`がスキーマを走らせる順番は、`@k8ordo/framework`の',
  en: '`run` sets the locale for `fn` and whatever it starts, and nothing else. `paramsSchema` sets it for the rest of the async context that called its validation. Whatever runs the schema decides which render runs in that context. For the order `@k8ordo/framework` runs schemas in, see `@k8ordo/framework`’s ',
});

export const browserTitle = message({
  ja: 'ブラウザ',
  en: 'Browser',
});

export const browserUrl = message({
  ja: 'ブラウザでは、`location.pathname`からViteの`base`を除いた最初の区間を、文言を呼ぶたびに読みます。',
  en: 'In the browser, a message reads the first segment of `location.pathname` below Vite’s `base` every time it is called.',
});

export const browserBeforeSet = message({
  ja: '集合を定義するモジュールがブラウザでまだ評価されていない間は、URLの区間がロケールかどうか分かりません。その間は、呼ばれた文言が文を持たない区間をロケールではないとみなし、最初に書いた文を返します。これで`/fr/…`の404ページはエラーになりません。',
  en: 'Until the module defining the set has run in the browser, there is no telling whether a segment is a locale. Meanwhile a segment the message has no text for counts as no locale, and the first text written is returned. That is what keeps a 404 page on `/fr/…` from throwing.',
});

export const lastTitle = message({
  ja: '集合の登録',
  en: 'Set registration',
});

export const lastRegister = message({
  ja: '`defineLocales`は集合を返すほかに、既定のロケールと`is`を`globalThis`に登録します。`message`は集合を受け取らないので、ここから既定のロケールと、区間がロケールかどうかを判定する`is`を読みます。',
  en: 'Besides returning the set, `defineLocales` registers the default locale and `is` on `globalThis`. `message` takes no set, so this is where it reads the default locale and `is`, the membership check, from.',
});

export const lastWins = message({
  ja: '登録は、後から定義した集合で上書きされます。開発サーバーがロケールを足した`i18n.ts`を評価し直したとき、次に呼ばれる文言が新しい集合を読めるようにするためです。',
  en: 'The last definition wins, so that when a dev server evaluates `i18n.ts` again after a locale is added, the next message called reads the new set.',
});

export const lastPitfall = message({
  ja: 'テストや補助関数の中で別の集合を定義すると、それ以降のすべての文言がその集合を読みます。直し方は',
  en: 'Define another set inside a test or a helper, and every message after it reads that set. For the fix, see ',
});

export const functionTitle = message({
  ja: '文言とバンドル',
  en: 'Messages and the bundle',
});

export const functionCallout = message({
  ja: 'ブラウザのバンドルに入るのはこの文言だけ',
  en: 'The only message in the browser bundle',
});

export const functionReturns = message({
  ja: '`message`が返すのは、受け取った文を持つ関数だけです。宣言の時点では、どこにも登録せず何も確かめません。そのため、どこからも呼ばれない文言は使われないコードとしてバンドラが取り除けます。',
  en: '`message` returns a function holding the text it was given, and nothing more. At the declaration it registers nothing and checks nothing, so a bundler drops a message nothing calls as dead code.',
});

export const functionBundle = message({
  ja: "ブラウザのバンドルに入るのは、`'use client'`のモジュールとそのimport先が名前で参照した文言だけです。入る文言は、すべてのロケールの文を持ちます。Server Componentだけが描画する文は、どのモジュールで宣言されていてもバンドルに入りません。",
  en: "The browser bundle carries only the messages that `'use client'` modules and their imports reference by name, each with its text in every locale. Text only a Server Component renders stays out, whichever module declares it.",
});

export const functionReasonsIntro = message({
  ja: '使われない文言を取り除けるように、次の3つも決めています。',
  en: 'Three more decisions keep unused messages removable.',
});

export const functionReasonDictionary = message({
  ja: '文言は1つの辞書オブジェクトにせず、1つずつexportします。辞書は丸ごと残るか丸ごと消えるかのどちらかです。',
  en: 'Messages are individual exports, not entries in one dictionary object. A dictionary is kept or dropped whole.',
});

export const functionReasonThrow = message({
  ja: 'ロケールの欠けは宣言の時点で確かめません。エラーになりうる宣言はバンドラが副作用とみなし、使われない文言を取り除けなくなります。型で検出できなかった欠けは、文言を読んだ時点で`TypeError: message: no text for "en" in ["ja"]`になります。',
  en: 'A missing locale is not checked at the declaration. A declaration that could throw counts as a side effect to the bundler, which then keeps unused messages too. A gap the types did not catch fails where the message is read, with `TypeError: message: no text for "en" in ["ja"]`.',
});

export const functionReasonNoSet = message({
  ja: '`message`はロケールの集合を引数に取りません。`locales.message(…)`のような集合のメソッドにすると、そのメソッドはほかの呼び出し（`defineLocales`）が返した関数になります。バンドラはその中を解析しないので、使われない文言が残ります。',
  en: '`message` does not take the locale set as an argument. As a method such as `locales.message(…)`, it would be a function another call (`defineLocales`) returned. The bundler does not look inside such a function, so unused messages would stay.',
});

export const guaranteesTitle = message({
  ja: '保証すること',
  en: 'Guarantees',
});

export const guarantees = [
  message({
    ja: '一覧に無いロケールは、`paramsSchema`が受け付けません。ブラウザでは集合が定義されたあと、URLの先頭の区間が一覧に無ければ、文言と`getLocale()`は既定のロケールを使います。',
    en: '`paramsSchema` refuses a locale outside the list. In the browser, once the set is defined, messages and `getLocale()` use the default locale when the first segment of the URL is outside the list.',
  }),
  message({
    ja: '`run`が設定したロケールは、`fn`とそこから始まる処理の中でだけ読まれます。同時に処理しているほかのリクエストには使われません。',
    en: 'A locale `run` set is read only inside `fn` and whatever it starts. It is never used for another request being handled at the same time.',
  }),
  message({
    ja: '`AsyncLocalStorage`の無いサーバーのランタイムでは、`paramsSchema`と`run`がエラーになります。既定のロケールで描画を続けることはありません。',
    en: 'On a server runtime without `AsyncLocalStorage`, `paramsSchema` and `run` throw. They never go on to render in the default locale.',
  }),
  message({
    ja: '文言と`getLocale()`はフックではありません。Server ComponentとClient Componentのどちらでも、イベントハンドラやほかの文言の関数の中でも呼べます。',
    en: 'Messages and `getLocale()` are not hooks. They can be called in a Server Component or a Client Component, in an event handler, or inside another message’s function.',
  }),
  message({
    ja: '`message`の宣言には副作用がありません。どこからも呼ばれない文言は、バンドラが取り除けます。',
    en: 'Declaring a message has no side effect, so a bundler can drop a message nothing calls.',
  }),
  message({
    ja: 'ロケールが欠けた文言は、ロケールの型が`Register`に登録されていれば型エラーになります。型を通り抜けた欠けは、文言を読んだ時点で`TypeError`になり、`undefined`は返しません。',
    en: 'A message missing a locale is a type error once `Register` carries the locale type. A gap that gets past the types throws a `TypeError` where the message is read, and never returns `undefined`.',
  }),
  message({
    ja: '`dateTimeFormat`は、サーバーでもどのブラウザでも、ロケールの`timeZone`で日付を書きます。',
    en: '`dateTimeFormat` writes a date in the locale’s `timeZone`, on the server and in every browser.',
  }),
] as const;

export const nonGuaranteesTitle = message({
  ja: '保証しないこと',
  en: 'Not guaranteed',
});

export const nonGuarantees = [
  message({
    ja: '文言と`getLocale()`は、URLの変化を購読しません。ブラウザでは、呼んだ時点のURLを読むだけです。',
    en: 'Messages and `getLocale()` do not subscribe to the URL. In the browser, they read it at the moment they are called.',
  }),
  message({
    ja: '呼んで得た文字列は、あとからロケールが変わっても変わりません。モジュールのトップレベルで呼ぶと、読み込んだときのロケールで固定されます。',
    en: 'A string a message returned does not change when the locale does. Called at the top level of a module, it stays in the locale of the moment the module loaded.',
  }),
  message({
    ja: 'サーバーでは、`paramsSchema`も`run`もロケールを設定していない処理の文言は、既定のロケールの文を返します。リクエストのURLやヘッダーは読みません。',
    en: 'On the server, a message called where neither `paramsSchema` nor `run` has set a locale returns the default locale’s text. It does not read the request’s URL or headers.',
  }),
  message({
    ja: '`paramsSchema`は、検証を呼んだ非同期コンテキストの残りにロケールを設定します。リクエストごとにコンテキストを分けるのは、スキーマを呼ぶ側です。',
    en: '`paramsSchema` sets the locale for the rest of the async context that called its validation. Keeping each request in a context of its own is up to whatever calls the schema.',
  }),
  message({
    ja: 'Client Componentが使う文言は、すべてのロケールの文を持ってブラウザのバンドルに入ります。ロケールごとにバンドルを分けません。',
    en: 'A message a Client Component uses ships to the browser with its text in every locale. The bundle is not split per locale.',
  }),
  message({
    ja: '`dateTimeFormat`を通さない日付と、今からの相対時間は、サーバーとブラウザで同じになるとは限りません。',
    en: 'A date not written through `dateTimeFormat`, and a time relative to now, can differ between the server and the browser.',
  }),
] as const;

export const see = message({
  ja: 'を見てください。',
  en: '.',
});
