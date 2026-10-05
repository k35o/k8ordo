import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '閉じるボタンのラベルや必須の印、読み込み中の読み上げのように、コンポーネントが自分で描く文言があります。これらは`@k8ordo/i18n`のいまのロケールで表示されるので、プロバイダに言語を渡す必要はありません。日本語と英語の辞書はライブラリが持ち、それ以外の言語はアプリが登録します。',
  en: 'Some wording is drawn by the components themselves: the label of a close button, the required marker, the loading announcement. It follows `@k8ordo/i18n`’s current locale, so there is no language to hand a provider. The library ships Japanese and English; any other language is registered by the application.',
});

export const localeTitle = message({
  ja: 'ロケールに従う',
  en: 'Follow the locale',
});

export const localeDescription = message({
  ja: 'アプリが`defineLocales`でロケールの一覧を定義していれば、コンポーネントはアプリの文言と同じロケールで描きます。URLがロケールを含んでいればそのロケール、含んでいなければ一覧の既定のロケールです。',
  en: 'When the application defines its locale set with `defineLocales`, the components draw in the same locale as its messages: the one the URL names, or the set’s default.',
});

export const clientGraph = message({
  ja: '一覧を定義したモジュールは、ブラウザでも読み込まれている必要があります。一覧が無い環境ではコンポーネントが英語で描くので、サーバーが描いたHTMLと食い違ってしまうからです。リンクを作る`bindParams`や言語の切り替えで、Client Componentがすでに`locales`をimportしていれば、それで足ります。',
  en: 'The module that defines the set has to load in the browser too. Where no set is defined the components speak English, and would disagree with the server’s HTML. A client component that already imports `locales` — for `bindParams` links or a language switcher — is enough.',
});

export const englishTitle = message({
  ja: 'ロケールの一覧が無ければ英語になる',
  en: 'English when there is no locale set',
});

export const englishDescription = message({
  ja: '`@k8ordo/i18n`でロケールの一覧を定義していないアプリ（Next.jsや素のViteのアプリなど）では、コンポーネントは英語で描きます。URLがたまたま`/ja/`で始まっていても変わらないので、サーバーとブラウザで食い違うことはありません。',
  en: 'An application that defines no set with `@k8ordo/i18n` — a Next.js or plain Vite app — gets English, whatever its URL starts with, so the server and the browser agree.',
});

export const englishJapanese = message({
  ja: '日本語だけのアプリでは、ロケールが1つだけの一覧を定義します。',
  en: 'A Japanese-only application defines a set of one.',
});

export const registerTitle = message({
  ja: 'ほかの言語を登録する',
  en: 'Register another language',
});

export const registerDescription = message({
  ja: '日本語と英語以外のロケールでは、`@k8ordo/ui/i18n`の`registerMessages`で辞書を登録します。ロケールの一覧を定義するモジュールの隣で呼んでください。',
  en: 'For a locale other than Japanese and English, register a dictionary with `registerMessages` from `@k8ordo/ui/i18n`, next to where the locale set is defined.',
});

export const registerTyped = message({
  ja: '辞書に`Messages`型を付けておくと、キーの過不足を型で確かめられます。ライブラリにキーが増えたときも、型エラーで気づけます。',
  en: 'Annotate the dictionary with `Messages`, and missing or extra keys fail to compile, including keys the library adds later.',
});

export const regional = message({
  ja: '`en-US`のように地域の付いたタグは、そのタグの辞書が無ければ言語（`en`）の辞書を使います。登録も組み込みの辞書も無いロケールで描こうとすると、登録を促すエラーを投げます。',
  en: 'A regional tag such as `en-US` falls back to its language’s dictionary (`en`) when it has none of its own. Rendering in a locale nothing has text for throws, naming how to register it.',
});

export const overrideTitle = message({
  ja: '一部の文言だけ差し替える',
  en: 'Replace a few words',
});

export const overrideDescription = message({
  ja: '登録した辞書は、組み込みの辞書より優先されます。組み込みの辞書を展開し、変えたいキーだけを重ねて登録します。',
  en: 'A registered dictionary wins over a built-in one. Spread the built-in dictionary and register it with the keys you want to change on top.',
});

export const priorityTitle = message({
  ja: 'どの文言が使われるか',
  en: 'Which wording wins',
});

export const priorityDescription = message({
  ja: '1つの文言を決める経路は3つあり、次の順に優先されます。',
  en: 'Three sources decide a piece of wording, in this order:',
});

export const priorityProp = message({
  ja: '個別のprops：`Spinner`の`label`のように、コンポーネントが文言のpropsを持っていれば、それが最も優先されます',
  en: 'A prop: when a component has a wording prop of its own, such as `Spinner`’s `label`, it wins',
});

export const priorityRegistered = message({
  ja: '登録した辞書：`registerMessages`で登録した辞書',
  en: 'A registered dictionary: one passed to `registerMessages`',
});

export const priorityBuiltIn = message({
  ja: '組み込みの辞書：ライブラリが持つ日本語と英語の辞書',
  en: 'The built-in dictionary: the Japanese and English the library ships',
});

export const priorityHint = message({
  ja: '1か所だけ違う文言にしたいときは、辞書ではなくpropsを使います。',
  en: 'To change the wording in one place only, use the prop rather than a dictionary.',
});

export const readTitle = message({
  ja: '自分で描く要素でも同じ文言を使う',
  en: 'Use the same wording in your own elements',
});

export const readDescription = message({
  ja: '`@k8ordo/ui/i18n`の`getMessages()`は、いまのロケールの文言を返します。フックではないので、Server ComponentからもClient Componentからも呼べます。',
  en: '`getMessages()` from `@k8ordo/ui/i18n` returns the wording in effect. It is not a hook, so a Server Component calls it as well as a Client Component.',
});

export const readWhy = message({
  ja: '`renderItem`で描く要素や、コンポーネントの隣に置く自作の部品でここから文言を読めば、言語も差し替えもコンポーネントとそろいます。',
  en: 'Read from it in an element drawn with `renderItem`, or a part of your own beside the components, and the language and any replacement stay in step with them.',
});

export const keysTitle = message({
  ja: '文言のキーの一覧',
  en: 'Every key',
});

export const keysDescription = message({
  ja: '`Messages`が持つすべてのキーです。値は、ライブラリの辞書をそのまま読み込んで表示しています。',
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
