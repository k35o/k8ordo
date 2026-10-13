import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '複数形や日付、数値の書式には`Intl`をそのまま使います。ロケールの集合が、今のロケールに合わせた`Intl`のオブジェクトを返します。',
  en: 'Plurals, dates and numbers are formatted with `Intl` itself. The locale set returns the `Intl` object for the current locale.',
});

export const membersTitle = message({
  ja: '`Intl`を返すメンバー',
  en: '`Intl` members',
});

export const priceCallout = message({
  ja: '今のロケールの`Intl.NumberFormat`',
  en: '`Intl.NumberFormat` for the current locale',
});

export const membersIntro = message({
  ja: 'そのメンバーは次の5つです。どれもフックではないので、Server ComponentでもClient Componentでも呼べます。',
  en: 'There are five such members. None is a hook, so they work in both Server Components and Client Components.',
});

export const membersList = [
  message({
    ja: '`dateTimeFormat(options?)`：`Intl.DateTimeFormat`',
    en: '`dateTimeFormat(options?)`: `Intl.DateTimeFormat`',
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
  ja: '`Intl`のオブジェクトをそのまま返すので、`format`や`formatToParts`、`formatRange`も使えます。オプションも`Intl`のものを渡します。',
  en: 'Each returns the `Intl` object itself, so `format`, `formatToParts` and `formatRange` are all available. The options are `Intl`’s own, too.',
});

export const membersOthers = message({
  ja: 'ここに無い`Intl.Collator`や`Intl.DisplayNames`は、`locales.getLocale()`のタグを渡して自分で作ります。',
  en: 'For an `Intl` API not listed here, such as `Intl.Collator` or `Intl.DisplayNames`, pass the tag from `locales.getLocale()` and make it yourself.',
});

export const datesTitle = message({
  ja: '日付',
  en: 'Dates',
});

export const publishedAtCallout = message({
  ja: 'ロケールの`timeZone`で表示する',
  en: 'Shown in the locale’s `timeZone`',
});

export const datesZone = message({
  ja: '`dateTimeFormat`は、ロケールに定義した`timeZone`で日付を表示します。実行環境のタイムゾーンは使いません。サーバーのHTMLとブラウザでの描画で、日付をそろえるためです。',
  en: '`dateTimeFormat` shows a date in the `timeZone` the locale defines, never in the runtime’s own zone. That keeps the date the same in the server’s HTML and in the browser’s render.',
});

export const datesChooseBefore = message({
  ja: 'ロケールごとのタイムゾーンの決め方は、',
  en: ' Choosing each locale’s time zone is covered under “Time zone” on the ',
});

export const see = message({
  ja: 'のページの「タイムゾーン」を見てください。',
  en: ' page.',
});

export const datesRefuse = message({
  ja: 'オプションの型は`timeZone`を受け付けません。`as`で型を通しても、ロケールの`timeZone`で上書きされます。',
  en: 'The options type does not accept `timeZone`. One forced through with `as` is overridden by the locale’s `timeZone`.',
});

export const datesVisitor = message({
  ja: '訪問者のタイムゾーンでの時刻や、今からの相対時間は、サーバーとブラウザで表示が食い違うことがあります。こうした表示は`Intl`を直接使い、ブラウザだけで描画する部分に置きます。',
  en: 'A time in the visitor’s own zone, or a time relative to now, can differ between the server and the browser. Use `Intl` directly for those, in a part that renders only in the browser.',
});

export const demoTitle = message({
  ja: 'タイムゾーンのデモ',
  en: 'Time zone demo',
});

export const demoDescription = message({
  ja: '同じ瞬間（協定世界時の2026年3月5日15時30分）を、ロケールの`timeZone`とブラウザのタイムゾーンで表示して比べます。',
  en: 'One instant, 15:30 UTC on 5 March 2026, shown in the locale’s `timeZone` and in the browser’s time zone.',
});

export const demoSteps = [
  message({
    ja: '上の行は、このページのロケールの`timeZone`で表示します。このサイトの`locales`は、`ja`を`Asia/Tokyo`、`en`を`UTC`で定義しています。日本語のページは3月6日、英語のページは3月5日になります。',
    en: 'The first row is shown in the page locale’s `timeZone`. This site defines `ja` as `Asia/Tokyo` and `en` as `UTC`, so the Japanese page shows 6 March and the English page 5 March.',
  }),
  message({
    ja: '下の行は、ブラウザで描画したあとに、このブラウザのタイムゾーンで表示します。ページのタイムゾーンと違えば、時刻や日付が上の行と食い違います。',
    en: 'The second row appears once the browser has rendered, in this browser’s time zone. If that differs from the page’s, the time or the date disagrees with the first row.',
  }),
  message({
    ja: 'ヘッダーの言語の切り替えで別の言語を選ぶと、上の行のタイムゾーンと日付が変わります。下の行のタイムゾーンは変わりません。',
    en: 'Pick the other language in the header. The first row’s time zone and date change; the second row’s do not.',
  }),
] as const;

export const demoPending = message({
  ja: 'ブラウザで描画したあとに表示します',
  en: 'Shown once the browser renders',
});

export const inMessagesTitle = message({
  ja: '文言の中の複数形と日付',
  en: 'Plurals and dates in messages',
});

export const cartCallout = message({
  ja: '英語の複数形を`Intl.PluralRules`で選ぶ',
  en: 'Picks the English plural with `Intl.PluralRules`',
});

export const inMessagesCall = message({
  ja: '値を差し込む文言の関数の中で呼ぶと、複数形や日付も文言の一部にできます。関数は自分のロケールを今のロケールにした状態で呼ばれるので、`Intl`もそのロケールのものになります。',
  en: 'Call these members inside a message function that takes values, and plurals and dates become part of the message. The function runs with its own locale as the current one, so the `Intl` object is that locale’s too.',
});

export const inMessagesPlural = message({
  ja: '英語の`pluralRules().select(1)`は`one`を返します。日本語では数にかかわらず`other`を返すので、日本語の文は1つで済みます。',
  en: 'In English, `pluralRules().select(1)` returns `one`. In Japanese it returns `other` for every number, so one Japanese form is enough.',
});

export const cacheTitle = message({
  ja: 'オブジェクトの再利用',
  en: 'Object reuse',
});

export const cacheOnce = message({
  ja: '`Intl`のオブジェクトは、ロケールとオプションの組ごとに1つだけ作られ、2回目からは同じものを返します。描画のたびに呼んでかまいません。',
  en: 'One `Intl` object is made per locale and options, and the same one is returned after that, so calling it on every render is fine.',
});

export const cacheKey = message({
  ja: 'オプションはJSONの文字列にして、キャッシュのキーにします。同じオプションを違う順に書くと2つ作られますが、結果は変わりません。',
  en: 'Options are keyed by their JSON string. The same options in another order make a second object, but never a different result.',
});
