import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`/`は、ロケールを持たない唯一のURLです。ここを開いた訪問者は、その人の言語のページへ送ります。このページでは、訪問者の希望からロケールを1つ選ぶ`negotiate`と、serverモードとstaticモードそれぞれでの`/`の書き方を説明します。',
  en: '`/` is the one URL without a locale, and whoever opens it is sent on to the page in their language. This page covers `negotiate`, which picks one locale from what the visitor asks for, and how `/` is written in `@k8ordo/framework`’s server mode and in its static mode.',
});

export const negotiateTitle = message({
  ja: '希望の並びから選ぶ',
  en: 'Choose from a list of preferences',
});

export const negotiateDescription = message({
  ja: '`locales.negotiate`は、訪問者の希望の並びから、集合のロケールを1つ選びます。ブラウザなら、`navigator.languages`をそのまま渡せます。',
  en: '`locales.negotiate` picks one locale of the set from the visitor’s list of preferences. In the browser, `navigator.languages` goes in as it is.',
});

export const negotiateSteps = [
  message({
    ja: '希望のタグを、先頭から1つずつ見ます。',
    en: 'Take the requested tags one at a time, from the first.',
  }),
  message({
    ja: 'そのタグと同じロケールが集合にあれば、それを返します。大文字と小文字は区別しないので、`en-gb`を求めても集合の綴りの`en-GB`が返ります。',
    en: 'If the set has that very tag, return it. Case does not matter, so a request for `en-gb` gets `en-GB`, spelled as the set spells it.',
  }),
  message({
    ja: '無ければ、同じ言語のロケールのうち、集合に先に書いたものを返します。',
    en: 'Otherwise, return the locale of the same language that comes first in the set.',
  }),
  message({
    ja: 'どちらも無ければ、次のタグへ進みます。BCP 47ではないタグは、エラーにせずに飛ばします。希望の並びは、訪問者が送ってくる値だからです。',
    en: 'If neither exists, move on to the next tag. A tag that is not BCP 47 is skipped rather than thrown on, because the list is what the visitor sent.',
  }),
  message({
    ja: '最後まで一致しなければ、既定のロケールを返します。',
    en: 'If nothing matched by the end, return the default locale.',
  }),
] as const;

export const negotiateWhy = message({
  ja: "先に並び全体から同じタグを探さないのは、訪問者の1番目の希望を優先するためです。`['en-US', 'ja']`を送る人がいちばん読みたいのは英語なので、集合に`en`があれば、2番目の`ja`が集合と同じタグでも`en`を返します。",
  en: "The whole list is not searched for an exact tag first, so that the visitor’s first choice wins. Someone who sends `['en-US', 'ja']` wants English most, so if the set has `en` they get `en`, even though `ja` further down is in the set exactly.",
});

export const negotiateLanguage = message({
  ja: '言語は`Intl.Locale`の`language`だけで比べ、用字や地域は比べません。そのため、`zh-Hans`と`zh-Hant`を持つ集合に`zh-Hant-TW`を求めると、先に書いた`zh-Hans`が選ばれます。',
  en: 'Languages are compared by `Intl.Locale`’s `language` alone; script and region are not weighed. With `zh-Hans` and `zh-Hant` in the set, a request for `zh-Hant-TW` gets `zh-Hans`, the one written first.',
});

export const demoTitle = message({
  ja: '交渉を試す',
  en: 'Try negotiation',
});

export const demoDescription = message({
  ja: '`Accept-Language`ヘッダーを書き換えると、`parseAcceptLanguage`が作る並びと、タグごとの結果、`negotiate`の答えがその場で変わります。集合はこのサイトの`locales`（`ja`と`en`、既定は`ja`）です。',
  en: 'Edit the `Accept-Language` header and watch the list `parseAcceptLanguage` makes, what became of each tag, and the answer `negotiate` gives. The set is this site’s own `locales` (`ja` and `en`, default `ja`).',
});

export const demoSteps = [
  message({
    ja: '最初に入っているヘッダーでは、`fr-CH`と`fr`はどのロケールにも一致せず、`en-US`が言語で`en`に一致します。答えは`en`で、その後ろの`ja`は見られません。',
    en: 'With the header already there, `fr-CH` and `fr` match no locale, and `en-US` matches `en` by language. The answer is `en`, and the `ja` after it is never looked at.',
  }),
  message({
    ja: '`en-US, ja`を押すと、`ja`は集合と同じタグですが、その前の`en-US`が言語で`en`に一致した時点で答えが決まります。',
    en: 'Press `en-US, ja`. `ja` is in the set exactly, but the answer is settled when `en-US` before it matches `en` by language.',
  }),
  message({
    ja: '`en_US, ja;q=0.5`を押すと、`en_US`はBCP 47ではないので飛ばされ、答えは`ja`になります。',
    en: 'Press `en_US, ja;q=0.5`. `en_US` is not BCP 47 and is skipped, so the answer is `ja`.',
  }),
  message({
    ja: '`*;q=0.5, en;q=0, de`を押すと、`*`と重みが0の`en`は並びから落ちます。残った`de`も一致しないので、答えは既定の`ja`です。',
    en: 'Press `*;q=0.5, en;q=0, de`. `*` and `en`, weighted 0, drop out of the list, and `de` matches nothing, so the answer is the default, `ja`.',
  }),
  message({
    ja: '「このブラウザのnavigator.languages」を押すと、このブラウザの言語の設定で交渉をやり直します。',
    en: 'Press “This browser’s navigator.languages” to negotiate again from this browser’s language settings.',
  }),
] as const;

export const demoPresets = message({
  ja: '例',
  en: 'Examples',
});

export const demoBrowser = message({
  ja: 'このブラウザのnavigator.languages',
  en: 'This browser’s navigator.languages',
});

export const demoParsed = message({
  ja: '`parseAcceptLanguage`が返す並び',
  en: 'The list `parseAcceptLanguage` returns',
});

export const demoEmpty = message({
  ja: '空の並びです。',
  en: 'An empty list.',
});

export const demoExact = message({
  ja: (locale: string) => `同じタグ → ${locale}`,
  en: (locale) => `same tag → ${locale}`,
});

export const demoLanguage = message({
  ja: (locale: string) => `同じ言語 → ${locale}`,
  en: (locale) => `same language → ${locale}`,
});

export const demoInvalid = message({
  ja: 'BCP 47ではないので飛ばす',
  en: 'not BCP 47, skipped',
});

export const demoNone = message({
  ja: '一致なし',
  en: 'no match',
});

export const demoNotConsulted = message({
  ja: '見ない（すでに決まった）',
  en: 'not looked at (already settled)',
});

export const demoAnswer = message({
  ja: '`negotiate`の答え',
  en: 'What `negotiate` returns',
});

export const demoFellBack = message({
  ja: 'どのタグも一致しなかったので、既定のロケールです。',
  en: 'No tag matched, so this is the default.',
});

export const headerTitle = message({
  ja: '`Accept-Language`を読む',
  en: 'Read `Accept-Language`',
});

export const headerDescription = message({
  ja: 'サーバーでは、リクエストの`Accept-Language`ヘッダーが訪問者の希望です。`parseAcceptLanguage`は、このヘッダーを`negotiate`に渡せる並びにします。',
  en: 'On a server, the request’s `Accept-Language` header is what the visitor asks for. `parseAcceptLanguage` turns it into a list `negotiate` takes.',
});

export const headerRules = [
  message({
    ja: '`q`の重みが大きい順に並べます。`q`の無いタグの重みは1です。',
    en: 'Tags are ordered by their `q` weight, highest first. A tag without one weighs 1.',
  }),
  message({
    ja: '重みが同じタグは、ヘッダーに書かれた順を保ちます。',
    en: 'Tags of equal weight keep the header’s order.',
  }),
  message({
    ja: '重みが0以下のタグと`*`は落とします。`*`は「どれでもよい」という意味で、それは既定のロケールがすでに表しているからです。',
    en: 'Tags weighted 0 or less, and `*`, are dropped. `*` means “anything”, which is what the default locale already means.',
  }),
  message({
    ja: '数値にならない`q`は無視し、重みを1のままにします。',
    en: 'A `q` that is not a number is ignored, and the tag keeps a weight of 1.',
  }),
  message({
    ja: 'ヘッダーが無い（`null`）ときと、空白だけのときは、空の配列を返します。',
    en: 'A missing header (`null`) or a blank one gives an empty array.',
  }),
] as const;

export const headerTags = message({
  ja: 'タグそのものは確かめません。BCP 47ではないタグは、`negotiate`が飛ばします。',
  en: 'The tags themselves are not checked; `negotiate` skips the ones that are not BCP 47.',
});

export const requestTitle = message({
  ja: 'リクエストから選ぶ',
  en: 'Choose from a request',
});

export const requestDescription = message({
  ja: '`negotiateRequest`は、`Request`からロケールを選びます。Cookieの名前を渡すと、訪問者が前に選んだ言語をCookieから先に読み、次に`Accept-Language`を読みます。',
  en: '`negotiateRequest` picks a locale for a `Request`. Give it a cookie name, and the language the visitor chose before is read from that cookie first, then `Accept-Language`.',
});

export const requestCookie = message({
  ja: 'Cookieの値もヘッダーの並びも、同じ`negotiate`の規則で選びます。そのため、集合からもう消したロケールがCookieに残っていても、続くヘッダーで選び直します。`cookie`を省くと、ヘッダーだけを読みます。',
  en: 'The cookie’s value and the header’s list go through the same `negotiate`, so a cookie still holding a locale the set no longer has falls through to the header. Without `cookie`, only the header is read.',
});

export const requestWriter = message({
  ja: 'Cookieを書く側は、「言語を切り替える」で説明しています。',
  en: 'Writing the cookie is covered in “Switch languages”.',
});

export const serverTitle = message({
  ja: 'serverモードで`/`に答える',
  en: 'Answer `/` in server mode',
});

export const serverDescription = message({
  ja: '`@k8ordo/framework`のserverモードでは、ページを描く前に`guard.ts`が`/`に答えます。`negotiateRequest`でロケールを選び、そのロケールのURLへの`307`を返します。',
  en: 'In `@k8ordo/framework`’s server mode, a `guard.ts` answers `/` before any page renders. It picks a locale with `negotiateRequest` and returns a `307` to that locale’s URL.',
});

export const serverTree = message({
  ja: 'ファイルは次のように置きます。',
  en: 'The files sit like this.',
});

export const serverGroup = message({
  ja: 'guardとページは、`(home)/`のようなルートグループに入れます。`guard.ts`は自分のディレクトリより下のすべてのURLの前に走るので、`routes/`の直下に置くと`/en/…`まで振り分けてしまうからです。',
  en: 'Put the guard and the page in a route group such as `(home)/`. A `guard.ts` runs before every URL below its directory, so one placed directly in `routes/` would send `/en/…` away too.',
});

export const serverPage = message({
  ja: 'ページは描かれませんが、置いておく必要があります。guardが走るのはページが宣言したURLの前だけで、ページが無ければ`/`は404になるためです。',
  en: 'The page never renders, but it has to exist: a guard runs only before a URL a page declares, and without one `/` is a 404.',
});

export const serverStatus = message({
  ja: '`308`ではなく`307`にするのは、答えが訪問者によって変わるからです。`localize`は`base`を付けないので、`withBase`で付け直します。',
  en: 'It is `307`, not `308`, because the answer depends on who asks. `localize` leaves Vite’s `base` out, so `withBase` puts it back.',
});

export const serverPayload = message({
  ja: 'JavaScriptが動かない訪問者も、`/`へのクライアントでの移動も、同じように振り分けられます。guardは、移動のときにブラウザが取りに来るペイロードのリクエストにも答えるからです。',
  en: 'A visitor without JavaScript is sent on all the same, and so is a client navigation to `/`: the guard also answers the payload request the browser makes for it.',
});

export const staticTitle = message({
  ja: 'staticモードで`/`に答える',
  en: 'Answer `/` in static mode',
});

export const staticDescription = message({
  ja: '`@k8ordo/framework`のstaticモードには、リクエストに答えるサーバーがありません。`guard.ts`も置けないので、`/`のページは何も描かず、ブラウザで交渉してから移動します。',
  en: '`@k8ordo/framework`’s static mode has no server to answer a request, and refuses a `guard.ts`. So the `/` page renders nothing, and negotiates and moves on in the browser.',
});

export const staticLinks = message({
  ja: '`navigateTo`は、`@k8ordo/framework`の`bindParams`で作ったものです。作り方は「ほかのパッケージと組み合わせる」で説明します。',
  en: '`navigateTo` is the one made with `@k8ordo/framework`’s `bindParams`; “Use with other packages” shows how.',
});

export const staticEffect = message({
  ja: '移動はeffectの中で行います。静的なビルドはこのページもブラウザの外で描くので、そこにはNavigation APIがありません。ビルドのときに`navigator.languages`があったとしても、それは訪問者ではなく、ビルドしているマシンのものです。',
  en: 'It moves from an effect. The static build renders this page outside a browser too, where there is no Navigation API; and a `navigator.languages` there, if any, belongs to the machine running the build, not the visitor.',
});

export const staticReplace = message({
  ja: "`history: 'replace'`にするのは、戻るボタンで`/`に戻り、また振り分けられるのを防ぐためです。",
  en: "`history: 'replace'` keeps the back button from returning to `/` only to be sent on again.",
});

export const staticWithoutRouter = message({
  ja: "`@k8ordo/router`を使わないアプリでは、`location.replace(locales.localize('/', locale))`で同じように移動できます。",
  en: "Without `@k8ordo/router`, `location.replace(locales.localize('/', locale))` does the same job.",
});

export const staticNoJs = message({
  ja: 'JavaScriptが動かない訪問者は、`/`から先へ進めません。',
  en: 'A visitor without JavaScript stays on `/`.',
});

export const staticCookie = message({
  ja: '選んだ言語をCookieに覚えているなら、その値を`navigator.languages`の前に並べて`negotiate`に渡します。サーバーの`negotiateRequest`が読むのと同じ順番です。',
  en: 'If the chosen language is kept in a cookie, put its value in front of `navigator.languages` and hand both to `negotiate`: the same order `negotiateRequest` reads them in on a server.',
});
