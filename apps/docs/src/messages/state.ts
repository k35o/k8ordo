import { message } from '@k8ordo/i18n';

export const tagline = message({
  ja: 'URLやlocalStorage、Cookieの値を`useState`のように読み書きするReactの状態管理',
  en: 'React state management that reads and writes values in the URL, localStorage and cookies like `useState`',
});

export const claimPlacesTitle = message({
  ja: '置き場所で決まる保存期間と共有範囲',
  en: 'Lifetime and reach, set by the place',
});

export const claimPlacesBody = [
  message({
    ja: '`definePageState`はURLと履歴エントリに、`defineLocalState`はlocalStorageに、`defineCookieState`はCookieに状態を置きます。',
    en: '`definePageState` keeps state in the URL and the history entry, `defineLocalState` in localStorage, and `defineCookieState` in a cookie.',
  }),
  message({
    ja: '再読み込みで残るか、ほかのタブやサーバーから読めるかは置き場所で決まります。どこに置いた状態も、同じ`useAppState`で読み書きします。',
    en: 'Whether it survives a reload, and whether other tabs or the server can read it, follows from the place. Wherever it lives, `useAppState` reads and writes it.',
  }),
] as const;

export const claimSchemaTitle = message({
  ja: 'zodのスキーマで型付けした値',
  en: 'Values typed by a zod schema',
});

export const claimSchemaBody = [
  message({
    ja: 'URLやストレージから読み戻した値はスキーマを通ります。合わないフィールドだけが既定値に戻り、ほかのフィールドはそのまま残ります。',
    en: 'Values read back from the URL or storage pass the schema. A field that does not fit falls back to its default, and the other fields keep theirs.',
  }),
  message({
    ja: '`update()`で書く値も同じスキーマで検証されます。TypeScriptの型もスキーマから作られるので、型を別に書くことはありません。',
    en: '`update()` runs the values it writes through the same schema. The TypeScript types come from the schema too, so nothing is written twice.',
  }),
] as const;

export const demoTitle = message({
  ja: 'URLの値のデモ',
  en: 'URL values demo',
});

export const demoDescription = message({
  ja: 'このページのURLを実際に書き換える`definePageState`です。',
  en: 'A `definePageState` that rewrites this page’s URL for real.',
});

export const demoSteps = [
  message({
    ja: 'アドレスバーで`page`を`0`に書き換えて開き直すと、`page`だけが`1`に戻り、`tab`はそのまま残ります。',
    en: 'Change `page` to `0` in the address bar and reload. Only `page` falls back to `1`; `tab` stays.',
  }),
  message({
    ja: '`page`の`+`を何度か押してから、ブラウザの戻るを押してください。`page`が1つずつ戻ります。',
    en: 'Press `+` beside `page` a few times, then the browser’s back button. `page` steps back one at a time.',
  }),
  message({
    ja: '`tab`を切り替えても、戻るの履歴は増えません。いまの履歴エントリを書き換えるだけです。',
    en: 'Switching `tab` adds nothing to the back history. It rewrites the current entry.',
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

export const navPlaces = message({
  ja: '置き場所',
  en: 'Places',
});

export const navUrl = message({
  ja: 'URL',
  en: 'URL',
});

export const navEntry = message({
  ja: '履歴エントリ',
  en: 'History entry',
});

export const navStorage = message({
  ja: 'ストレージとメモリ',
  en: 'Storage and memory',
});

export const navCookie = message({
  ja: 'Cookie',
  en: 'Cookie',
});

export const navLinks = message({
  ja: 'リンク',
  en: 'Links',
});

export const navNextjs = message({
  ja: 'Next.js',
  en: 'Next.js',
});

export const navUpdates = message({
  ja: '更新',
  en: 'Updates',
});

export const navMigrate = message({
  ja: 'マイグレーション',
  en: 'Migration',
});

export const navBeforeHydration = message({
  ja: 'ハイドレーション前',
  en: 'Before hydration',
});

export const navTesting = message({
  ja: 'テスト',
  en: 'Testing',
});

export const navHowItWorks = message({
  ja: '仕組み',
  en: 'How it works',
});

export const navReference = message({
  ja: 'API',
  en: 'API',
});

export const navTroubleshooting = message({
  ja: 'トラブルシューティング',
  en: 'Troubleshooting',
});
