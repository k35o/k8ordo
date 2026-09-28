import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '複数形・日付・数値・並びの書式は `Intl` そのものです。ロケール集合は、今のロケール（日付ならそのロケールのタイムゾーンも）で `Intl` のオブジェクトを引き、作ったものを使い回します。独自の書式の記法はありません。',
  en: 'Plurals, dates, numbers and lists are `Intl` itself. The locale set draws the `Intl` object for the current locale — and, for a date, that locale’s time zone — and reuses what it made. There is no format syntax of its own.',
});

export const members = {
  title: message({
    ja: '集合が引く `Intl`',
    en: 'The `Intl` the set draws',
  }),
  description: message({
    ja: 'どれも集合のメンバーで、hook ではありません。Server Component でも Client Component でも、文言の関数の中でも呼べます。',
    en: 'Each is a member of the set, not a hook: call it in a Server Component, in a Client Component, or inside a message.',
  }),
  memberColumn: message({
    ja: 'メンバー',
    en: 'Member',
  }),
  returnsColumn: message({
    ja: '返すもの',
    en: 'Returns',
  }),
  dateTimeFormat: message({
    ja: '今のロケールと、そのロケールの `timeZone` の `Intl.DateTimeFormat`。',
    en: "`Intl.DateTimeFormat` in the current locale and that locale's `timeZone`.",
  }),
  numberFormat: message({
    ja: '今のロケールの `Intl.NumberFormat`。',
    en: '`Intl.NumberFormat` in the current locale.',
  }),
  relativeTimeFormat: message({
    ja: '今のロケールの `Intl.RelativeTimeFormat`。',
    en: '`Intl.RelativeTimeFormat` in the current locale.',
  }),
  pluralRules: message({
    ja: '今のロケールの `Intl.PluralRules`。',
    en: '`Intl.PluralRules` in the current locale.',
  }),
  listFormat: message({
    ja: '今のロケールの `Intl.ListFormat`。',
    en: '`Intl.ListFormat` in the current locale.',
  }),
  itself: message({
    ja: '返すのは `Intl` のオブジェクトそのものなので、`format`・`formatToParts`・`formatRange`・`select`・`resolvedOptions` は `Intl` のものをそのまま使えます。オプションも `Intl` のものです。',
    en: 'What comes back is the `Intl` object itself, so `format`, `formatToParts`, `formatRange`, `select` and `resolvedOptions` are `Intl`’s own, and so are the options.',
  }),
  others: message({
    ja: 'ここに無い `Intl`（`Intl.Collator`、`Intl.DisplayNames` など）は、`getLocale()` のタグを渡して自分で作ります。',
    en: 'For an `Intl` API not listed here (`Intl.Collator`, `Intl.DisplayNames`, …), pass the tag from `getLocale()` and make it yourself.',
  }),
};

export const timeZone = {
  title: message({
    ja: '日付はロケールのタイムゾーンで',
    en: "Dates in the locale's time zone",
  }),
  description: message({
    ja: '`dateTimeFormat` は、`defineLocales` に書いたそのロケールの `timeZone` でしか日付を書きません。',
    en: '`dateTimeFormat` writes a date only in the `timeZone` the locale was defined with.',
  }),
  why: message({
    ja: '実行環境のタイムゾーンは、サーバーではサーバーのもの、ブラウザでは訪問者のものです。それに任せて日付を書くと、サーバーの HTML とブラウザの hydrate で文が変わり、日付の境目では 1 日ずれます。ロケールのタイムゾーンは両側で同じなので、この食い違いが起きません。',
    en: "The runtime's own time zone is the server's on the server and the visitor's in the browser. A date left to it reads one way in the server's HTML and another while hydrating — a different day, near midnight. The locale's time zone is the same on both sides, so the two agree.",
  }),
  refused: message({
    ja: 'オプションの型は `timeZone` を受け付けません。`as` で押し通しても、ロケールのタイムゾーンが上書きします。',
    en: 'The options type refuses a `timeZone`, and one forced through with `as` is overridden by the locale’s.',
  }),
  visitor: message({
    ja: '訪問者のタイムゾーンで見せたい表示（手元の時計、今からの相対時間）は、サーバーとブラウザで必ず違うものです。`Intl` を直接使い、ブラウザだけで描く部分に置きます。',
    en: "A display that should follow the visitor's own zone — a local clock, a time relative to now — necessarily differs between the server and the browser. Use `Intl` directly for it, in a part that renders in the browser only.",
  }),
};

export const inMessages = {
  title: message({
    ja: '文言の中で',
    en: 'Inside a message',
  }),
  description: message({
    ja: '値を取る文言の関数の中で呼べば、複数形も日付もその文言の一部になります。関数が呼ばれるのは、そのロケールが今のロケールのときです。',
    en: "Called inside a message's function, plurals and dates become part of the message. The function runs when its locale is the current one.",
  }),
};

export const cache = {
  title: message({
    ja: '作ったものは使い回す',
    en: 'Made once, reused',
  }),
  description: message({
    ja: '`Intl` のオブジェクトは作るのが重いので、ロケールとオプションの組ごとに 1 つ作り、次からは同じものを返します。',
    en: 'An `Intl` object is costly to make, so one is made per locale and options, and the same one is returned after that.',
  }),
  key: message({
    ja: 'オプションは JSON で見分けます。同じオプションを違う順で書くと 2 つ作られますが、答えが変わることはありません。描画のたびに呼んでも、作り直しにはなりません。',
    en: 'Options are told apart by their JSON: the same options spelled in another order make a second object, never a different answer. Calling it on every render does not make a new one.',
  }),
};
