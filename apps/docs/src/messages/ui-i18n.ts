import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '閉じるボタンのラベルや必須の印のように、コンポーネントが自分で表示する文言は、`@k8ordo/i18n`の現在のロケールに従います。ほかの言語の登録や一部の差し替えをして、自作の要素からも同じ文言を読めるようになります。',
  en: 'The wording a component renders by itself, such as a close button’s label or the required marker, follows `@k8ordo/i18n`’s current locale. Here you register another language, replace a few entries, and read the same wording from your own elements.',
});

export const localeTitle = message({
  ja: 'ロケールの決まり方',
  en: 'Locale selection',
});

export const localeSet = message({
  ja: 'アプリが`defineLocales`でロケールの一覧を定義していれば、コンポーネントはアプリの文言と同じロケールで表示します。URLにロケールがあればそのロケールで、無ければ一覧の既定のロケールです。プロバイダも、渡す設定もありません。',
  en: 'When the application defines its locale set with `defineLocales`, the components render in the same locale as its messages: the one in the URL, or the set’s default. There is no provider and nothing to pass.',
});

export const clientGraph = message({
  ja: '一覧を定義したモジュールは、ブラウザでも読み込まれている必要があります。ブラウザに一覧が無いとコンポーネントが英語で表示するので、ハイドレーションでサーバーのHTMLと食い違います。`bindParams`のリンクや言語の切り替えのために`locales`をimportするClient Componentがあれば、それで足ります。',
  en: 'The module that defines the set has to load in the browser too. Without the set in the browser, the components render in English and no longer match the server’s HTML during hydration. A Client Component that imports `locales` for `bindParams` links or a language switcher is enough.',
});

export const englishTitle = message({
  ja: '一覧が無いアプリ',
  en: 'Apps without a locale set',
});

export const englishFallback = message({
  ja: '`@k8ordo/i18n`でロケールの一覧を定義していないアプリでは、コンポーネントは英語で表示します。Next.jsや素のViteのアプリなどがこれにあたります。URLが`/ja/`で始まっていても変わらないので、サーバーとブラウザは食い違いません。',
  en: 'An application that defines no locale set with `@k8ordo/i18n`, such as a Next.js or plain Vite app, renders the components in English. The URL starting with `/ja/` changes nothing, so the server and the browser agree.',
});

export const englishJapanese = message({
  ja: '日本語だけのアプリは、このようにロケールが1つだけの一覧を定義します。',
  en: 'A Japanese-only application defines a set with a single locale, like this.',
});

export const registerTitle = message({
  ja: 'ほかの言語の登録',
  en: 'Registering another language',
});

export const registerDictionary = message({
  ja: '日本語と英語の辞書はライブラリが持ちます。ほかのロケールは、`@k8ordo/ui/i18n`の`registerMessages`で辞書を登録します。辞書に`Messages`型を付けると、キーの過不足が型エラーになります。ライブラリにキーが増えたときも型で気づけます。',
  en: 'The library ships the Japanese and English dictionaries. Any other locale is registered with `registerMessages` from `@k8ordo/ui/i18n`. Annotate the dictionary with `Messages`, and a missing or extra key is a type error, including a key the library adds later.',
});

export const registerWhere = message({
  ja: '`registerMessages`は、ロケールの一覧を定義するモジュールで呼びます。',
  en: 'Call `registerMessages` in the module that defines the locale set.',
});

export const regional = message({
  ja: '`en-US`のように地域の付いたタグは、そのタグの辞書が無ければ言語（`en`）の辞書を使います。登録も組み込みの辞書も無いロケールで表示しようとすると、エラーになります。エラー文はそのロケールを挙げて（`no built-in text for "de"`）、`registerMessages`での登録を促します。',
  en: 'A regional tag such as `en-US` uses its language’s dictionary (`en`) when it has none of its own. Rendering in a locale with neither a registered nor a built-in dictionary fails with an error that names the locale, such as `no built-in text for "de"`, and asks you to register it with `registerMessages`.',
});

export const overrideTitle = message({
  ja: '一部の差し替え',
  en: 'Replacing a few entries',
});

export const overrideSpread = message({
  ja: '組み込みの`ja`や`en`を展開し、変えたいキーだけを重ねて登録します。',
  en: 'Spread the built-in `ja` or `en`, put the keys you want to change on top, and register the result.',
});

export const priorityTitle = message({
  ja: '優先順位',
  en: 'Precedence',
});

export const priorityOrder = message({
  ja: '1つの文言は、次の順に決まります。',
  en: 'Each piece of wording comes from the first of these that has it:',
});

export const priorityProp = message({
  ja: 'コンポーネントのprops：`Spinner`の`label`のような、文言を受け取るprops',
  en: 'A component prop: a prop that takes wording, such as `Spinner`’s `label`',
});

export const priorityRegistered = message({
  ja: '登録した辞書：`registerMessages`で登録した辞書',
  en: 'A registered dictionary: one passed to `registerMessages`',
});

export const priorityBuiltIn = message({
  ja: '組み込みの辞書：ライブラリが持つ日本語と英語の辞書',
  en: 'A built-in dictionary: the Japanese and English the library ships',
});

export const priorityHint = message({
  ja: '1か所だけ変えるときは、propsを使います。',
  en: 'To change the wording in one place only, use the prop.',
});

export const readTitle = message({
  ja: '自作の要素の文言',
  en: 'Wording in your own elements',
});

export const readFunction = message({
  ja: '`@k8ordo/ui/i18n`の`getMessages()`は、現在のロケールの文言を返します。フックではないので、Server ComponentからもClient Componentからも呼べます。',
  en: '`getMessages()` from `@k8ordo/ui/i18n` returns the wording for the current locale. It is not a hook, so you can call it from Server and Client Components alike.',
});

export const readAligned = message({
  ja: '`renderItem`で返す要素や自作のコンポーネントで`getMessages()`から読めば、言語も差し替えもコンポーネントとそろいます。',
  en: 'Read from `getMessages()` in an element returned from `renderItem` or in a component of your own, and the language and any replacements match the components.',
});

export const propsTitle = message({
  ja: 'propsの文言',
  en: 'Wording in props',
});

export const propsString = message({
  ja: '`@k8ordo/i18n`の`message`で書いた文言は関数なので、呼んだ結果をpropsに渡します。書き方は',
  en: 'A message written with `message` from `@k8ordo/i18n` is a function, so pass what it returns to the prop. See ',
});

export const see = message({
  ja: 'を見てください。',
  en: '.',
});

export const keysTitle = message({
  ja: 'キーの一覧',
  en: 'Key list',
});

export const keysAll = message({
  ja: '`Messages`が持つすべてのキーです。値はライブラリの辞書から読み込んでいます。',
  en: 'Every key `Messages` holds. The values are read from the library’s own dictionaries.',
});

export const keyColumn = message({
  ja: 'キー',
  en: 'Key',
});

export const usedByColumn = message({
  ja: '使うコンポーネント',
  en: 'Used by',
});

export const jaColumn = message({
  ja: 'ja',
  en: 'ja',
});

export const enColumn = message({
  ja: 'en（一覧が無いとき）',
  en: 'en (no locale set)',
});
