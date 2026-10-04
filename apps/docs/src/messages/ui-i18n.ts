import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'コンポーネントが自前で描画する文言（閉じるボタンのラベル、必須バッジ、読み込み中の読み上げなど）は、`@k8ordo/i18n`の今のロケールで引かれます。Providerに渡すものはありません。`ja`と`en`の辞書はライブラリが持ち、それ以外の言語はアプリケーションが登録します。',
  en: "Wording the components render on their own — close button labels, the required badge, the loading announcement — is looked up in `@k8ordo/i18n`'s current locale. Nothing is passed to a provider. The library ships `ja` and `en`; the application registers any other language.",
});

export const localeTitle = message({
  ja: 'ロケールは`@k8ordo/i18n`から',
  en: 'The locale comes from `@k8ordo/i18n`',
});

export const localeDescription = message({
  ja: 'アプリケーションが`defineLocales`で集合を定義していれば、コンポーネントは文言と同じロケールで描きます。URLが名指すロケール、名指さなければ集合の既定です。',
  en: 'Once the application defines its set with `defineLocales`, the components speak the same locale its messages do: the one the URL names, or the default of the set when it names none.',
});

export const clientGraph = message({
  ja: '集合を定義するモジュールは、ブラウザ側でも読み込まれている必要があります。集合が無い環境ではコンポーネントは英語で描くので、サーバーのHTMLと食い違います。Client Componentが`bindParams`のリンクや言語切替で`locales`をimportしていれば、それで足ります。',
  en: 'The module that defines the set has to be loaded in the browser as well: where no set is defined the components speak English, which would disagree with the server’s HTML. A Client Component that imports `locales` — for `bindParams` links or a language switcher — is enough.',
});

export const englishTitle = message({
  ja: '集合が無ければ英語',
  en: 'English without a set',
});

export const englishDescription = message({
  ja: '`@k8ordo/i18n`で集合を定義していないアプリケーション（Next.jsや素のViteのアプリなど）では、コンポーネントは英語で描きます。URLがたまたま`/ja/…`で始まっていても変わらないので、サーバーとブラウザで食い違いません。日本語だけのアプリは、ロケールが1つの集合を定義します。',
  en: 'In an application that defines no set with `@k8ordo/i18n` — a Next.js or plain Vite application — the components speak English. That holds even when the URL happens to start with `/ja/…`, so the server and the browser agree. A Japanese-only application defines a set of one locale.',
});

export const registerTitle = message({
  ja: 'ほかの言語を登録する',
  en: 'Registering another language',
});

export const registerDescription = message({
  ja: '`ja`と`en`以外のロケールは、`@k8ordo/ui/i18n`の`registerMessages(locale, messages)`で辞書を登録します。集合を定義するモジュールの隣で呼んでください。`Messages`型を注釈すれば、キーの過不足はコンパイル時に分かり、ライブラリにキーが増えたときも型エラーで気付けます。',
  en: 'For a locale other than `ja` and `en`, register a dictionary with `registerMessages(locale, messages)` from `@k8ordo/ui/i18n`, next to where the set is defined. Annotated with the `Messages` type, a missing or misspelled key is a compile error — including when the library adds one.',
});

export const regional = message({
  ja: '`en-US`のように地域のついたタグは、そのタグの辞書が無ければ言語（`en`）の辞書を読みます。登録も組み込みも無いロケールで描くと、登録を促すエラーを投げます。',
  en: 'A regional tag such as `en-US` without a dictionary of its own reads its language’s (`en`). Rendering in a locale nothing has text for throws, naming how to register it.',
});

export const overrideTitle = message({
  ja: '一部だけ差し替える',
  en: 'Replacing some of the wording',
});

export const overrideDescription = message({
  ja: '登録した辞書は組み込みの辞書より優先されます。組み込みの辞書を展開してから、変えたいキーを重ねて登録します。',
  en: 'A registered dictionary wins over the built-in one. Spread the built-in dictionary, lay the keys you want over it, and register the result.',
});

export const priorityTitle = message({
  ja: '優先順位',
  en: 'Resolution order',
});

export const priorityDescription = message({
  ja: '同じ文言を決める経路は3つあり、prop >登録した辞書>組み込みの辞書 の順に強くなります。個別のprops（Spinnerのlabelなど）は常に辞書より優先されるので、1か所だけ違う文言にしたいときはそちらを使ってください。',
  en: 'Three sources can decide a string, and they win in the order prop > registered dictionary > built-in dictionary. Per-instance props (such as the Spinner label) always beat a dictionary, so reach for them when only one place should read differently.',
});

export const readTitle = message({
  ja: '自分の要素で文言を読む',
  en: 'Reading the wording in your own elements',
});

export const readDescription = message({
  ja: '`@k8ordo/ui/i18n`の`getMessages()`は、いまのロケールの文言を返します。hookではないので、Server ComponentからもClient Componentからも呼べます。`renderItem`で描く要素や、コンポーネントの隣に置く自作の部品でここから読めば、言語も差し替えもコンポーネントと揃います。',
  en: '`getMessages()` from `@k8ordo/ui/i18n` returns the wording in the current locale. It is not a hook, so a Server Component calls it as readily as a Client Component. Read from it in an element you draw through `renderItem`, or in a component of your own beside the library, and it follows the same language and replacements the components do.',
});

export const keysTitle = message({
  ja: 'キー一覧',
  en: 'Key reference',
});

export const keysDescription = message({
  ja: 'Messagesが持つキーの全てです。値はライブラリの辞書そのものを読み込んで表示しています。',
  en: 'Every key in Messages. The values below are read from the shipped dictionaries themselves.',
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
  ja: 'en（集合が無いとき）',
  en: 'en (without a set)',
});
