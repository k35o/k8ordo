import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'コンポーネントが自前で描画する文言（閉じるボタンのラベル、必須バッジ、読み込み中の読み上げなど）は、`@k8ordo/i18n` の今のロケールで引かれます。Provider に渡すものはありません。`ja` と `en` の辞書はライブラリが持ち、それ以外の言語はアプリケーションが登録します。',
  en: "Wording the components render on their own — close button labels, the required badge, the loading announcement — is looked up in `@k8ordo/i18n`'s current locale. Nothing is passed to a provider. The library ships `ja` and `en`; the application registers any other language.",
});

export const localeTitle = message({
  ja: 'ロケールは `@k8ordo/i18n` から',
  en: 'The locale comes from `@k8ordo/i18n`',
});

export const localeDescription = message({
  ja: 'アプリケーションが `defineLocales` で集合を定義していれば、コンポーネントは文言と同じロケールで描きます。URL が名指すロケール、名指さなければ集合の既定です。',
  en: 'Once the application defines its set with `defineLocales`, the components speak the same locale its messages do: the one the URL names, or the default of the set when it names none.',
});

export const clientGraph = message({
  ja: '集合を定義するモジュールは、ブラウザ側でも読み込まれている必要があります。集合が無い環境ではコンポーネントは英語で描くので、サーバーの HTML と食い違います。Client Component が `bindParams` のリンクや言語切替で `locales` を import していれば、それで足ります。',
  en: 'The module that defines the set has to be loaded in the browser as well: where no set is defined the components speak English, which would disagree with the server’s HTML. A Client Component that imports `locales` — for `bindParams` links or a language switcher — is enough.',
});

export const englishTitle = message({
  ja: '集合が無ければ英語',
  en: 'English without a set',
});

export const englishDescription = message({
  ja: '`@k8ordo/i18n` で集合を定義していないアプリケーション（Next.js や素の Vite のアプリなど）では、コンポーネントは英語で描きます。URL がたまたま `/ja/…` で始まっていても変わらないので、サーバーとブラウザで食い違いません。日本語だけのアプリは、ロケールが 1 つの集合を定義します。',
  en: 'In an application that defines no set with `@k8ordo/i18n` — a Next.js or plain Vite application — the components speak English. That holds even when the URL happens to start with `/ja/…`, so the server and the browser agree. A Japanese-only application defines a set of one locale.',
});

export const registerTitle = message({
  ja: 'ほかの言語を登録する',
  en: 'Registering another language',
});

export const registerDescription = message({
  ja: '`ja` と `en` 以外のロケールは、`@k8ordo/ui/i18n` の `registerMessages(locale, messages)` で辞書を登録します。集合を定義するモジュールの隣で呼んでください。`Messages` 型を注釈すれば、キーの過不足はコンパイル時に分かり、ライブラリにキーが増えたときも型エラーで気付けます。',
  en: 'For a locale other than `ja` and `en`, register a dictionary with `registerMessages(locale, messages)` from `@k8ordo/ui/i18n`, next to where the set is defined. Annotated with the `Messages` type, a missing or misspelled key is a compile error — including when the library adds one.',
});

export const regional = message({
  ja: '`en-US` のように地域のついたタグは、そのタグの辞書が無ければ言語（`en`）の辞書を読みます。登録も組み込みも無いロケールで描くと、登録を促すエラーを投げます。',
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
  ja: '同じ文言を決める経路は 3 つあり、prop > 登録した辞書 > 組み込みの辞書 の順に強くなります。個別の props（Spinner の label など）は常に辞書より優先されるので、1 か所だけ違う文言にしたいときはそちらを使ってください。',
  en: 'Three sources can decide a string, and they win in the order prop > registered dictionary > built-in dictionary. Per-instance props (such as the Spinner label) always beat a dictionary, so reach for them when only one place should read differently.',
});

export const readTitle = message({
  ja: '自分の要素で文言を読む',
  en: 'Reading the wording in your own elements',
});

export const readDescription = message({
  ja: '`@k8ordo/ui/i18n` の `getMessages()` は、いまのロケールの文言を返します。hook ではないので、Server Component からも Client Component からも呼べます。`renderItem` で描く要素や、コンポーネントの隣に置く自作の部品でここから読めば、言語も差し替えもコンポーネントと揃います。',
  en: '`getMessages()` from `@k8ordo/ui/i18n` returns the wording in the current locale. It is not a hook, so a Server Component calls it as readily as a Client Component. Read from it in an element you draw through `renderItem`, or in a component of your own beside the library, and it follows the same language and replacements the components do.',
});

export const serverTitle = message({
  ja: 'Server Component のまま描ける',
  en: 'Rendered as Server Components',
});

export const serverDescription = message({
  ja: '文言を読むのが hook ではなくなったので、文言のためだけに Client Component だった `Spinner`・`Breadcrumb`・`Code`・`Alert`・`Reasoning`・`ToolInvocation` は Server Component に戻りました。Server Component から描けば、ブラウザに JavaScript を送りません。',
  en: 'Reading the wording is no longer a hook, so `Spinner`, `Breadcrumb`, `Code`, `Alert`, `Reasoning` and `ToolInvocation`, which were Client Components only for their wording, are Server Components again. Rendered from a Server Component, they send the browser no JavaScript.',
});

export const migrationTitle = message({
  ja: '3.x からの移行',
  en: 'Migrating from 3.x',
});

export const migrationDescription = message({
  ja: '`UIProvider` の `messages`、`useMessages`、`dictionaries` はなくなりました。手順は次のとおりです。',
  en: '`UIProvider`’s `messages`, `useMessages` and `dictionaries` are gone. Move over in these steps:',
});

export const migrationProvider = message({
  ja: '`UIProvider` から `messages` を外します。`UIProvider` は Toast のために残ります。',
  en: 'Drop `messages` from `UIProvider`. `UIProvider` stays, for toasts.',
});

export const migrationLocale = message({
  ja: '既定が日本語から英語に変わりました。日本語で描いていたアプリは、`@k8ordo/i18n` で集合を定義します（日本語だけなら `ja` 1 つ）。そのモジュールを、サーバーの描画とブラウザの両方で読み込まれる場所から import します。',
  en: 'The default is now English rather than Japanese. An application that rendered in Japanese defines a set with `@k8ordo/i18n` (just `ja`, for a Japanese-only one) and imports that module from somewhere both the server render and the browser load.',
});

export const migrationRegister = message({
  ja: '`messages` に渡していた辞書や差し替えは、`registerMessages(locale, messages)` で登録します。一部だけの差し替えは、組み込みの辞書を展開して重ねます。',
  en: 'A dictionary or replacement once passed as `messages` is registered with `registerMessages(locale, messages)`; to replace a few keys, spread the built-in dictionary and lay them over it.',
});

export const migrationRead = message({
  ja: "`useMessages()` は `getMessages()` に置き換えます。hook ではないので、呼ぶための `'use client'` は要らなくなります。",
  en: "Replace `useMessages()` with `getMessages()`. It is not a hook, so it needs no `'use client'` of its own.",
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
