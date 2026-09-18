import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'コンポーネントが自前で描画する文言（閉じるボタンのラベル、必須バッジ、読み込み中の読み上げなど）は文言辞書から引かれます。辞書を差し替えれば、アプリのコードを変えずに言語や語彙を切り替えられます。',
  en: 'Wording the components render on their own — close button labels, the required badge, the loading announcement — comes from a message dictionary. Replace the dictionary and the language changes without touching your own code.',
});

export const defaultTitle = message({
  ja: '既定は日本語',
  en: 'Japanese by default',
});

export const defaultDescription = message({
  ja: '設定は不要です。UIProviderを置くだけで日本語の辞書が使われ、Providerを置いていない場合も同じ日本語にフォールバックします。',
  en: 'No setup required. UIProvider uses the Japanese dictionary, and components fall back to the same Japanese wording even without a provider.',
});

export const englishTitle = message({
  ja: '英語に切り替える',
  en: 'Switching to English',
});

export const englishDescription = message({
  ja: '@k8ordo/ui/i18nからenを読み込み、messagesに渡します。jaも同じ場所から読み込めます。',
  en: 'Import en from @k8ordo/ui/i18n and pass it to messages. ja ships from the same entry point.',
});

export const localeTitle = message({
  ja: '描画中のロケールで選ぶ',
  en: 'Picking by the rendered locale',
});

export const localeDescription = message({
  ja: '複数のロケールで描画するアプリは、描画中のロケールで辞書を選びます。`@k8ordo/ui/i18n`の`dictionaries`は、組み込みの辞書をすべてロケールのタグをキーにして持っています。',
  en: 'An application that renders in several locales picks the dictionary by the locale it is rendering. `dictionaries` from `@k8ordo/ui/i18n` holds every built-in dictionary keyed by its locale tag.',
});

export const overrideTitle = message({
  ja: '一部だけ差し替える',
  en: 'Overriding part of a dictionary',
});

export const overrideDescription = message({
  ja: 'messagesはPartial<Messages> です。渡したキーだけが上書きされ、残りは日本語の既定辞書で埋まります。英語をベースに一部だけ変えたいときはenを展開してから重ねます。',
  en: 'messages is a Partial<Messages>. Only the keys you pass are replaced; the rest fall back to the Japanese defaults. To start from English instead, spread en first and layer your changes on top.',
});

export const priorityTitle = message({
  ja: '優先順位',
  en: 'Resolution order',
});

export const priorityDescription = message({
  ja: '同じ文言を決める経路は3つあり、prop > 辞書 > 既定 の順に強くなります。個別のprops（Spinnerのlabelなど）は常に辞書より優先されるので、1箇所だけ違う文言にしたいときはそちらを使ってください。',
  en: 'Three sources can decide a string, and they win in the order prop > dictionary > default. Per-instance props (such as the Spinner label) always beat the dictionary, so reach for them when only one place should read differently.',
});

export const customTitle = message({
  ja: '独自の辞書を作る',
  en: 'Writing your own dictionary',
});

export const customDescription = message({
  ja: 'Messages型を注釈すれば、キーの過不足はコンパイル時に検出されます。ライブラリにキーが増えたときも型エラーで気付けます。',
  en: 'Annotate with the Messages type and missing or misspelled keys become compile errors — including when the library adds a key.',
});

export const readTitle = message({
  ja: '自分の要素で文言を読む',
  en: 'Reading the wording in your own elements',
});

export const readDescription = message({
  ja: '`@k8ordo/ui/i18n`の`useMessages`は、既定の辞書に`UIProvider`へ渡した辞書を重ねた、いま有効な文言を返します。`renderItem`で描く要素や、コンポーネントの隣に置く自作の部品でここから読めば、言語も上書きもコンポーネントと揃います。Client Componentから呼んでください。',
  en: '`useMessages` from `@k8ordo/ui/i18n` returns the wording in effect: the built-in dictionary with whatever you passed to `UIProvider` laid over it. Read from it in an element you draw through `renderItem`, or in a component of your own that sits beside the library, and it follows the same language and overrides as the components do. Call it from a Client Component.',
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
  ja: 'ja（既定）',
  en: 'ja (default)',
});

export const enColumn = message({
  ja: 'en',
  en: 'en',
});
