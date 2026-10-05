import { message } from '@k8ordo/i18n';

export const tagline = message({
  ja: '状態を「どこに置くか」で宣言し、URLやストレージから読み戻す値をzodのスキーマで型付けする。',
  en: 'Declare state by where it lives, and type what comes back from the URL or storage with a zod schema.',
});

export const claimPlacesTitle = message({
  ja: '置き場所を選ぶと、状態の残り方が決まる',
  en: 'Pick the place, and you have picked how it lasts',
});

export const claimPlacesBody = [
  message({
    ja: '`definePageState`はURLと履歴エントリに、`defineLocalState`はlocalStorageに、`defineCookieState`はCookieに状態を置きます。',
    en: '`definePageState` keeps state in the URL and the history entry, `defineLocalState` in localStorage, and `defineCookieState` in a cookie.',
  }),
  message({
    ja: 'ブラウザの戻るで元に戻るか、再読み込みしても残るか、ほかのタブやサーバーから読めるかは、置き場所によって決まります。どこに置いた状態も、読み書きには同じ`useAppState`を使います。',
    en: 'Whether it comes back with the back button, survives a reload, or reaches other tabs and the server follows from the place. Wherever it lives, `useAppState` reads and writes it.',
  }),
] as const;

export const claimHistoryTitle = message({
  ja: 'URLの状態は、戻るボタンとリンクの共有に乗る',
  en: 'URL state rides the back button and shared links',
});

export const claimHistoryBody = [
  message({
    ja: "`update`はNavigation APIを通してURLを書き換えます。`{ history: 'push' }`を付けた更新だけが履歴に積まれるので、ブラウザの戻るで1つずつ元に戻せます。",
    en: "`update` rewrites the URL through the Navigation API. Only updates given `{ history: 'push' }` add a history entry, and the back button undoes them one at a time.",
  }),
  message({
    ja: 'URLから読んだ値は、必ずスキーマを通します。手で書き換えた値がスキーマに合わなければ、その項目だけが既定値に戻り、ほかの項目はそのまま残ります。',
    en: 'Values read from the URL go through the schema. A hand-edited value that does not fit falls back to its default, and the other fields keep theirs.',
  }),
] as const;

export const claimServerTitle = message({
  ja: 'サーバーも同じ定義で状態を読む',
  en: 'The server reads the same definition',
});

export const claimServerBody = [
  message({
    ja: '`@k8ordo/server`のページは、URLのスキーマを`search`として書き出しておくと、検証済みの値を受け取れます。Cookieは`parseCookies`で読むので、保存した設定が最初の描画から反映されます。',
    en: 'A page under `@k8ordo/server` exports the url schema as `search` and receives the parsed values. Cookies are read with `parseCookies`, so a saved preference is there from the first render.',
  }),
  message({
    ja: '`href`は、既定値の項目を省いたリンクを作ります。同じ状態はいつも同じURLになり、JavaScriptが届く前からリンクとして使えます。',
    en: '`href` builds links with the defaults left out. The same state is always the same URL, and the link works before JavaScript arrives.',
  }),
] as const;

export const demoTitle = message({
  ja: '戻るボタンで巻き戻す',
  en: 'Rewind with the back button',
});

export const demoDescription = message({
  ja: 'このページのURLを実際に書き換える、本物の`definePageState`です。',
  en: 'A real `definePageState` that rewrites this page’s URL.',
});

export const demoSteps = [
  message({
    ja: '`page`の+を何度か押してから、ブラウザの戻るを押してみてください。`page`が1つずつ戻ります。',
    en: 'Press + beside `page` a few times, then the browser’s back button. `page` steps back one at a time.',
  }),
  message({
    ja: '`tab`を切り替えても、戻るの履歴は増えません。いまの履歴エントリを書き換えているだけだからです。',
    en: 'Switching `tab` adds nothing to the back history. It rewrites the current entry.',
  }),
  message({
    ja: 'アドレスバーで`page`を`0`に書き換えて開き直すと、`page`だけが1に戻ります。',
    en: 'Change `page` to `0` in the address bar and reload. Only `page` falls back to 1.',
  }),
] as const;

export const demoPrevious = message({
  ja: 'pageを減らす',
  en: 'Decrease page',
});

export const demoNext = message({
  ja: 'pageを増やす',
  en: 'Increase page',
});

export const demoUrlEmpty = message({
  ja: 'クエリなし（すべて既定値）',
  en: 'no query (all defaults)',
});

export const nextGetStarted = message({
  ja: 'URLに検索条件を置き、コンポーネントとサーバーで読むところまで作ります。',
  en: 'Put search filters in the URL, and read them in a component and on the server.',
});

export const nextPlaces = message({
  ja: '置き場所ごとの状態の残り方と、スキーマの書き方です。',
  en: 'How long each place lasts, and how to write its schema.',
});

export const nextReading = message({
  ja: '`parseUrl`と`parseCookies`での読み取りと、`href`でのリンクの作り方です。',
  en: 'Reading with `parseUrl` and `parseCookies`, and building links with `href`.',
});

export const nextUpdates = message({
  ja: '`update`での検証と書き込みのまとめ方、履歴の扱いです。',
  en: 'How `update` validates, batches, and treats history.',
});

export const nextIntegrations = message({
  ja: 'ルーターや`@k8ordo/form`のGETフォームとの組み合わせ方と、テストの書き方です。',
  en: 'Routers, GET forms with `@k8ordo/form`, and testing.',
});

export const navPlaces = message({
  ja: '置き場所を選ぶ',
  en: 'Choose a place',
});

export const navUrl = message({
  ja: 'URLに状態を置く',
  en: 'State in the URL',
});

export const navEntry = message({
  ja: '履歴エントリに状態を置く',
  en: 'State in the history entry',
});

export const navStorage = message({
  ja: '端末に好みを保存する',
  en: 'Save preferences on the device',
});

export const navReading = message({
  ja: '読み取りとリンク',
  en: 'Reading & links',
});

export const navUpdates = message({
  ja: '更新',
  en: 'Updates',
});

export const navIntegrations = message({
  ja: '組み合わせ',
  en: 'Integrations',
});
