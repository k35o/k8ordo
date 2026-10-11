import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`/`はロケールを持たない唯一のURLです。訪問者の希望の言語からロケールを1つ選び、そのロケールのURLへ送れるようになります。',
  en: '`/` is the one URL without a locale. Here you pick one locale from the languages the visitor asks for and send them to that locale’s URL.',
});

export const negotiateTitle = message({
  ja: '希望する言語からの選択',
  en: 'Choosing from preferred languages',
});

export const negotiateIntro = message({
  ja: '`locales.negotiate`は、訪問者が希望する言語のリストから、定義したロケールを1つ選びます。ブラウザなら、`navigator.languages`をそのまま渡せます。',
  en: '`locales.negotiate` picks one of your defined locales from the visitor’s list of preferred languages. In the browser, `navigator.languages` can be passed as it is.',
});

export const negotiateSteps = [
  message({
    ja: '希望のタグを先頭から1つずつ見ます。',
    en: 'Take the requested tags one at a time, from the first.',
  }),
  message({
    ja: 'そのタグと同じロケールを定義していれば、それを返します。大文字と小文字は区別しません。`en-gb`を渡すと、定義したとおりの`en-GB`が返ります。',
    en: 'If that exact tag is defined, return it. Case does not matter: passing `en-gb` returns `en-GB`, spelled as it was defined.',
  }),
  message({
    ja: '無ければ、同じ言語のロケールのうち先に定義したものを返します。',
    en: 'Otherwise, return the locale of the same language that was defined first.',
  }),
  message({
    ja: 'どちらも無ければ、次のタグへ進みます。BCP 47ではないタグはエラーにせず飛ばします。',
    en: 'If neither exists, move on to the next tag. A tag that is not BCP 47 is skipped without an error.',
  }),
  message({
    ja: '最後まで一致しなければ、既定のロケールを返します。',
    en: 'If nothing matched by the end, return the default locale.',
  }),
] as const;

export const negotiateWhy = message({
  ja: "リスト全体から同じタグを先に探すことはしません。`['en-US', 'ja']`を送る訪問者がいちばん読みたいのは英語です。`en`を定義していれば、2番目の`ja`が定義と同じタグでも`en`を返します。",
  en: "The whole list is never searched for an exact tag first. A visitor who sends `['en-US', 'ja']` wants English most, so if `en` is defined, the answer is `en`, even though `ja` further down is defined exactly.",
});

export const negotiateLanguage = message({
  ja: '言語は`Intl.Locale`の`language`だけで比べ、文字体系（script）や地域は比べません。`zh-Hans`と`zh-Hant`を定義していて`zh-Hant-TW`を渡すと、先に定義した`zh-Hans`が選ばれます。',
  en: 'Languages are compared by `Intl.Locale`’s `language` alone, not by script or region. With `zh-Hans` and `zh-Hant` defined, passing `zh-Hant-TW` returns `zh-Hans`, the one defined first.',
});

export const demoTitle = message({
  ja: '言語の選択のデモ',
  en: 'Language selection demo',
});

export const demoDescription = message({
  ja: 'このサイトの`locales`（`ja`と`en`、既定は`ja`）で、`Accept-Language`ヘッダーからロケールを選ぶデモです。',
  en: 'A demo that picks a locale from an `Accept-Language` header with this site’s own `locales` (`ja` and `en`, default `ja`).',
});

export const demoSteps = [
  message({
    ja: '最初に入っているヘッダーでは、`fr-CH`と`fr`はどのロケールにも一致しません。`en-US`が言語で`en`に一致し、答えは`en`になります。',
    en: 'With the header already there, `fr-CH` and `fr` match no locale. `en-US` matches `en` by language, so the answer is `en`.',
  }),
  message({
    ja: '`en-US, ja`を押します。答えは`en`のままで、`ja`は見ません。',
    en: 'Press `en-US, ja`. The answer stays `en`, and `ja` is never looked at.',
  }),
  message({
    ja: '`en_US, ja;q=0.5`を押します。`en_US`はBCP 47ではないので飛ばされ、答えは`ja`になります。',
    en: 'Press `en_US, ja;q=0.5`. `en_US` is not BCP 47 and is skipped, so the answer is `ja`.',
  }),
  message({
    ja: '`*;q=0.5, en;q=0, de`を押します。`*`と重みが0の`en`はリストから除かれます。残った`de`も一致しないので、答えは既定の`ja`です。',
    en: 'Press `*;q=0.5, en;q=0, de`. `*` and `en`, weighted 0, are removed from the list. `de` matches nothing either, so the answer is the default, `ja`.',
  }),
  message({
    ja: '「このブラウザのnavigator.languages」を押すと、このブラウザの言語の設定で選び直します。',
    en: 'Press “This browser’s navigator.languages” to choose again from this browser’s language settings.',
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
  ja: '`Accept-Language`の読み取り',
  en: 'Reading `Accept-Language`',
});

export const headerIntro = message({
  ja: 'サーバーでは、リクエストの`Accept-Language`ヘッダーが訪問者の希望です。`parseAcceptLanguage`は、このヘッダーを`negotiate`に渡せる配列に変換します。',
  en: 'On a server, the request’s `Accept-Language` header is what the visitor asks for. `parseAcceptLanguage` turns it into an array `negotiate` accepts.',
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
    ja: '重みが0以下のタグと`*`は除きます。どのタグも一致しなければ既定のロケールになるので、`*`は要りません。',
    en: 'Tags weighted 0 or less, and `*`, are removed. When nothing matches, the default locale is used anyway, so `*` adds nothing.',
  }),
  message({
    ja: '数値にならない`q`は無視し、重みを1のままにします。',
    en: 'A `q` that is not a number is ignored, and the tag keeps a weight of 1.',
  }),
  message({
    ja: 'ヘッダーが無い（`null`）ときと空白だけのときは、空の配列を返します。',
    en: 'A missing header (`null`) or a blank one gives an empty array.',
  }),
] as const;

export const headerTags = message({
  ja: 'タグそのものは確かめません。BCP 47ではないタグは、`negotiate`が飛ばします。',
  en: 'The tags themselves are not checked. `negotiate` skips the ones that are not BCP 47.',
});

export const requestTitle = message({
  ja: 'リクエストからの選択',
  en: 'Choosing from a request',
});

export const requestIntro = message({
  ja: '`negotiateRequest`は、`Request`からロケールを選びます。`cookie`にCookieの名前を渡すと、訪問者が前に選んだ言語をCookieから先に読み、次に`Accept-Language`を読みます。',
  en: '`negotiateRequest` picks a locale from a `Request`. Give it a cookie name in `cookie`, and the language the visitor chose before is read from that cookie first, then `Accept-Language`.',
});

export const requestCookie = message({
  ja: 'Cookieの値もヘッダーのリストも、同じ`negotiate`の規則で選びます。定義から消したロケールがCookieに残っていても、続くヘッダーで選び直します。`cookie`を省くと、ヘッダーだけを読みます。',
  en: 'The cookie’s value and the header’s list go through the same `negotiate` rules. A cookie still holding a locale that is no longer defined falls through to the header. Without `cookie`, only the header is read.',
});

export const requestWriterBefore = message({
  ja: 'Cookieを書く側は、',
  en: 'Writing the cookie is covered in ',
});

export const requestWriterAfter = message({
  ja: (section: string) => `の「${section}」を見てください。`,
  en: (section) => `, under “${section}”.`,
});

export const serverTitle = message({
  ja: 'サーバーでの`/`',
  en: '`/` on a server',
});

export const serverGuardCallout = message({
  ja: 'Cookie、次にAccept-Languageの順で選ぶ',
  en: 'The cookie first, then Accept-Language',
});

export const serverStatusCallout = message({
  ja: '訪問者ごとに答えが変わるので307',
  en: '307, since the answer depends on who asks',
});

export const serverIntro = message({
  ja: 'サーバーが`/`へのリクエストに応答できるなら、ページを描画せずにリダイレクトします。`negotiateRequest`でロケールを選び、そのロケールのURLへの`307`を返します。',
  en: 'When a server answers requests for `/`, it can redirect without rendering a page. Pick a locale with `negotiateRequest` and return a `307` to that locale’s URL.',
});

export const serverBase = message({
  ja: '`localize`の結果にはViteの`base`が付きません。`base`の下に置くアプリでは、移動先にする前に付けます。',
  en: '`localize` leaves out Vite’s `base`. In an app served under one, add it before using the pathname as the destination.',
});

export const serverFramework = message({
  ja: '`@k8ordo/framework`では、serverモードならこの処理を`/`だけに答える`guard.ts`に、staticモードなら次の節の処理を`/`のページに書きます。詳しくは`@k8ordo/framework`の',
  en: 'In `@k8ordo/framework`, this goes in a `guard.ts` that answers `/` alone under server mode, and the next section’s code goes in the `/` page under static mode. See `@k8ordo/framework`’s ',
});

export const see = message({
  ja: 'を見てください。',
  en: '.',
});

export const staticTitle = message({
  ja: 'ブラウザでの`/`',
  en: '`/` in the browser',
});

export const staticIntro = message({
  ja: 'サーバーの無いサイトでは、`/`のページがブラウザでロケールを選びます。ページは何も描画せず、`negotiate`で選んだロケールのURLへ移動します。',
  en: 'A site without a server picks the locale in the browser, on the `/` page. The page renders nothing and moves to the URL of the locale `negotiate` picks.',
});

export const staticEffect = message({
  ja: '移動は`useEffect`の中で行います。サーバーやビルドでの描画には、`location`も訪問者の`navigator.languages`もありません。',
  en: 'The move happens in a `useEffect`. A render on a server or at build time has neither `location` nor the visitor’s `navigator.languages`.',
});

export const staticReplace = message({
  ja: '`location.replace`は履歴エントリを置き換えるので、戻るボタンで`/`に戻ってまた移動することがありません。',
  en: '`location.replace` replaces the history entry, so the back button never returns to `/` only to be sent on again.',
});

export const staticNoJs = message({
  ja: 'JavaScriptが動かない訪問者は、`/`から先へ進めません。',
  en: 'A visitor without JavaScript stays on `/`.',
});

export const staticCookieTitle = message({
  ja: 'Cookieの読み取り',
  en: 'Reading the cookie',
});

export const staticCookie = message({
  ja: '選んだ言語をCookieに覚えているなら、その値を`navigator.languages`の前に並べて`negotiate`に渡します。サーバーの`negotiateRequest`が読むのと同じ順番です。',
  en: 'If the chosen language is kept in a cookie, put its value in front of `navigator.languages` and hand both to `negotiate`. That is the order `negotiateRequest` reads them in on a server.',
});
