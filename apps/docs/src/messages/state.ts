import { message } from '@k8ordo/i18n';

export const tagline = message({
  ja: '状態を置き場所ごとに宣言し、URL やストレージから戻る値を zod スキーマで型付けする。',
  en: 'Declare state by where it lives, and type what comes back from the URL or storage with a zod schema.',
});

export const claimPlacesTitle = message({
  ja: '置き場所を選べば、残り方が決まる',
  en: 'Pick the place, and you have picked how it lasts',
});

export const claimPlacesBody = [
  message({
    ja: '`definePageState` は URL と履歴エントリに、`defineLocalState` は localStorage に、`defineCookieState` は Cookie に状態を置きます。',
    en: '`definePageState` keeps state in the URL and the history entry, `defineLocalState` in localStorage, and `defineCookieState` in a cookie.',
  }),
  message({
    ja: '戻るで戻るか、再読み込みで残るか、ほかのタブやサーバーから読めるかは、置き場所で決まります。どこに置いても、読み書きは `useAppState` 1 つです。',
    en: 'Whether it comes back with the back button, survives a reload, or reaches other tabs and the server follows from the place. Wherever it lives, `useAppState` reads and writes it.',
  }),
] as const;

export const claimHistoryTitle = message({
  ja: 'URL の状態は、戻るボタンと共有に乗る',
  en: 'URL state rides the back button and shared links',
});

export const claimHistoryBody = [
  message({
    ja: "`update` は Navigation API で URL を書き換えます。`{ history: 'push' }` を付けた更新だけが履歴に積まれ、戻るで 1 つずつ戻ります。",
    en: "`update` rewrites the URL through the Navigation API. Only updates given `{ history: 'push' }` add a history entry, and the back button undoes them one at a time.",
  }),
  message({
    ja: 'URL から読んだ値はスキーマを通します。手で書き換えた値が合わなければ、その欄だけが既定値に戻り、ほかの欄は残ります。',
    en: 'Values read from the URL go through the schema. A hand-edited value that does not fit falls back to its default, and the other fields keep theirs.',
  }),
] as const;

export const claimServerTitle = message({
  ja: 'サーバーも同じ定義で読む',
  en: 'The server reads the same definition',
});

export const claimServerBody = [
  message({
    ja: '`@k8ordo/server` のページは、URL のスキーマを `search` として書き出すと、検証済みの値を受け取ります。Cookie は `parseCookies` で読むので、保存した設定が最初の描画から出ます。',
    en: 'A page under `@k8ordo/server` exports the url schema as `search` and receives the parsed values. Cookies are read with `parseCookies`, so a saved preference is there from the first render.',
  }),
  message({
    ja: '`href` は既定値を省いたリンクを作ります。同じ状態はいつも同じ URL になり、JavaScript が届く前から押せます。',
    en: '`href` builds links with the defaults left out. The same state is always the same URL, and the link works before JavaScript arrives.',
  }),
] as const;

export const demoTitle = message({
  ja: '戻るボタンで巻き戻す',
  en: 'Rewind with the back button',
});

export const demoDescription = message({
  ja: 'このページの URL を書き換える、本物の `definePageState` です。',
  en: 'A real `definePageState` that rewrites this page’s URL.',
});

export const demoSteps = [
  message({
    ja: '`page` の + を何度か押してから、ブラウザの戻るを押します。`page` が 1 つずつ戻ります。',
    en: 'Press + beside `page` a few times, then the browser’s back button. `page` steps back one at a time.',
  }),
  message({
    ja: '`tab` を切り替えても、戻るの履歴は増えません。今の履歴エントリを書き換えるだけです。',
    en: 'Switching `tab` adds nothing to the back history. It rewrites the current entry.',
  }),
  message({
    ja: 'アドレスバーで `page` を `0` に書き換えて開き直すと、`page` だけが 1 に戻ります。',
    en: 'Change `page` to `0` in the address bar and reload. Only `page` falls back to 1.',
  }),
] as const;

export const demoPrevious = message({
  ja: 'page を減らす',
  en: 'Decrease page',
});

export const demoNext = message({
  ja: 'page を増やす',
  en: 'Increase page',
});

export const demoUrlEmpty = message({
  ja: 'クエリなし（すべて既定値）',
  en: 'no query (all defaults)',
});

export const nextGetStarted = message({
  ja: 'URL に検索条件を置き、コンポーネントとサーバーで読むまでを作ります。',
  en: 'Put search filters in the URL, and read them in a component and on the server.',
});

export const nextPlaces = message({
  ja: '置き場所ごとの残り方と、スキーマの書き方です。',
  en: 'How long each place lasts, and how to write its schema.',
});

export const nextReading = message({
  ja: '`parseUrl`・`parseCookies` での読み取りと、`href` でのリンク作りです。',
  en: 'Reading with `parseUrl` and `parseCookies`, and building links with `href`.',
});

export const nextUpdates = message({
  ja: '`update` の検証・まとめ方・履歴の扱いです。',
  en: 'How `update` validates, batches, and treats history.',
});

export const nextIntegrations = message({
  ja: 'ルーター・`@k8ordo/form` の GET フォーム・テストとの組み合わせです。',
  en: 'Routers, GET forms with `@k8ordo/form`, and testing.',
});

export const navPlaces = message({
  ja: '置き場所',
  en: 'Places',
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
