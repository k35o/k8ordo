import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '複数形や日付、数値の書式には、`Intl`をそのまま使います。ロケールの集合は、今のロケールに合わせた`Intl`のオブジェクトを作って返すだけで、独自の書式の記法はありません。日付だけは、そのロケールの`timeZone`で書きます。',
  en: 'Plurals, dates and numbers are `Intl` itself. The locale set only makes the `Intl` object for the current locale and hands it back; there is no format syntax of its own. Dates alone are written in the locale’s `timeZone`.',
});

export const membersTitle = message({
  ja: '今のロケールの`Intl`を使う',
  en: 'Use `Intl` for the current locale',
});

export const membersDescription = message({
  ja: '集合の次の5つのメンバーが、今のロケールの`Intl`のオブジェクトを返します。どれもフックではないので、Server ComponentでもClient Componentでも、文言の関数の中でも呼べます。',
  en: 'These five members of the set return an `Intl` object for the current locale. None is a hook, so each can be called in a Server Component, in a Client Component, or inside a message’s function.',
});

export const membersList = [
  message({
    ja: '`dateTimeFormat(options?)`：`Intl.DateTimeFormat`。ロケールの`timeZone`で書く',
    en: '`dateTimeFormat(options?)`: `Intl.DateTimeFormat`, in the locale’s `timeZone`',
  }),
  message({
    ja: '`numberFormat(options?)`：`Intl.NumberFormat`',
    en: '`numberFormat(options?)`: `Intl.NumberFormat`',
  }),
  message({
    ja: '`relativeTimeFormat(options?)`：`Intl.RelativeTimeFormat`',
    en: '`relativeTimeFormat(options?)`: `Intl.RelativeTimeFormat`',
  }),
  message({
    ja: '`pluralRules(options?)`：`Intl.PluralRules`',
    en: '`pluralRules(options?)`: `Intl.PluralRules`',
  }),
  message({
    ja: '`listFormat(options?)`：`Intl.ListFormat`',
    en: '`listFormat(options?)`: `Intl.ListFormat`',
  }),
] as const;

export const membersItself = message({
  ja: '返すのは`Intl`のオブジェクトそのものなので、`format`や`formatToParts`、`formatRange`もそのまま使えます。オプションも`Intl`のものです。',
  en: 'What comes back is the `Intl` object itself, so `format`, `formatToParts` and `formatRange` are all there, and the options are `Intl`’s own.',
});

export const membersOthers = message({
  ja: 'ここに無い`Intl.Collator`や`Intl.DisplayNames`は、`locales.getLocale()`のタグを渡して自分で作ります。',
  en: 'For an `Intl` API not listed here, such as `Intl.Collator` or `Intl.DisplayNames`, make it yourself with the tag from `locales.getLocale()`.',
});

export const datesTitle = message({
  ja: '日付を書く',
  en: 'Write a date',
});

export const datesDescription = message({
  ja: '`dateTimeFormat`は、ロケールに書いた`timeZone`でしか日付を書きません。サーバーが書いたHTMLとブラウザでの描画で、日付がずれないようにするためです。',
  en: '`dateTimeFormat` writes a date only in the `timeZone` the locale states, so the date does not shift between the server’s HTML and the browser’s render.',
});

export const datesRefuse = message({
  ja: 'オプションの型は`timeZone`を受け付けません。`as`で型を通しても、ロケールの`timeZone`で上書きします。',
  en: 'Its options type refuses a `timeZone`, and one forced through with `as` is overridden by the locale’s.',
});

export const datesVisitor = message({
  ja: '訪問者の手元の時計や、今からの相対時間は、サーバーとブラウザで必ず違う表示です。こうしたものは`Intl`を直接使い、ブラウザだけで描く部分に置きます。',
  en: 'A clock in the visitor’s zone, or a time relative to now, always differs between the server and the browser. Use `Intl` directly for those, in a part that renders in the browser only.',
});

export const demoTitle = message({
  ja: 'ロケールのタイムゾーンで書く',
  en: 'Write in the locale’s time zone',
});

export const demoDescription = message({
  ja: '同じ瞬間（協定世界時の2026年3月5日15時30分）を、2つの方法で書いています。このサイトの`locales`は、`ja`を`Asia/Tokyo`、`en`を`UTC`で定義しています。下の行は、ブラウザで描いたあとに表示します。',
  en: 'One instant, 15:30 UTC on 5 March 2026, written two ways. This site’s `locales` defines `ja` in `Asia/Tokyo` and `en` in `UTC`. The second row appears once the browser has rendered.',
});

export const demoSteps = [
  message({
    ja: '上の行は、このページのロケールのタイムゾーンで書かれます。日本語のページは`Asia/Tokyo`なので3月6日、英語のページは`UTC`なので3月5日です。',
    en: 'The first row is written in the page locale’s time zone: `Asia/Tokyo` on the Japanese page, so 6 March, and `UTC` on the English page, so 5 March.',
  }),
  message({
    ja: '下の行は、このブラウザのタイムゾーンで書かれます。ページのタイムゾーンと違えば、時刻や日付が上の行と食い違います。',
    en: 'The second row is written in this browser’s time zone. If it differs from the page’s, the time or the date disagrees with the first row.',
  }),
  message({
    ja: 'ヘッダーの言語の切り替えで別の言語を選ぶと、上の行のタイムゾーンと日付が変わります。下の行のタイムゾーンは変わりません。',
    en: 'Pick the other language in the header’s language switcher. The first row’s time zone and date change; the second row’s time zone does not.',
  }),
] as const;

export const demoPending = message({
  ja: 'ブラウザで描いたあとに表示します',
  en: 'Shown once the browser renders',
});

export const inMessagesTitle = message({
  ja: '文言の中で使う',
  en: 'Use it inside a message',
});

export const inMessagesDescription = message({
  ja: '値を差し込む文言の関数の中で呼べば、複数形や日付も文言の一部になります。関数が呼ばれるのはそのロケールが今のロケールのときなので、`Intl`もそのロケールのものになります。',
  en: 'Called inside a message’s function, plurals and dates become part of the message. The function runs while its locale is the current one, so the `Intl` object is that locale’s too.',
});

export const inMessagesPlural = message({
  ja: '英語の`pluralRules().select(1)`は`one`を返し、日本語では数にかかわらず`other`を返します。そのため、日本語の文は1つで済みます。',
  en: 'In English `pluralRules().select(1)` is `one`; in Japanese it is `other` whatever the number, so Japanese needs one form only.',
});

export const cacheTitle = message({
  ja: '作ったオブジェクトを使い回す',
  en: 'Made once, reused',
});

export const cacheDescription = message({
  ja: '`Intl`のオブジェクトは作るのに手間がかかるので、ロケールとオプションの組ごとに1つだけ作り、次からは同じものを返します。描画のたびに呼んでも、作り直しにはなりません。',
  en: 'An `Intl` object is costly to make, so one is made per locale and options and the same one is returned after that. Calling it on every render does not make a new one.',
});

export const cacheKey = message({
  ja: 'オプションは、JSONにして見分けます。同じオプションを違う順に書くと2つ作られますが、答えが変わることはありません。',
  en: 'Options are told apart by their JSON: the same options in another order make a second object, never a different answer.',
});
