import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '文言と`getLocale()`が読むロケールは、テストの実行環境で決まります。Nodeでは`locales.run`で、ブラウザではURLでロケールを選びます。',
  en: 'The locale that messages and `getLocale()` read depends on where the test runs. Under Node, `locales.run` selects it; in a browser, the URL does.',
});

export const nodeTitle = message({
  ja: 'Nodeのテスト',
  en: 'Tests under Node',
});

export const nodeDefault = message({
  ja: 'ロケールを指定しなければ、文言は既定のロケールの文を返します。別のロケールで確かめるときは、`locales.run`の中で呼びます。',
  en: 'With no locale named, a message returns the default locale’s text. To check another locale, call the message inside `locales.run`.',
});

export const nodeAsync = message({
  ja: 'async関数を渡しても、`await`をまたいでロケールは保たれます。同時に動く`run`どうしのロケールが互いに影響することもありません。',
  en: 'An async function keeps its locale across `await`. Concurrent `run` calls keep their locales apart.',
});

export const schemaTitle = message({
  ja: '`paramsSchema`のテスト',
  en: 'Testing `paramsSchema`',
});

export const schemaContext = message({
  ja: '`paramsSchema`がロケールを受け付けると、呼び出し元の非同期コンテキストの残り全体に、そのロケールが設定されます。テストから直接呼ぶと、後のテストにもロケールが残ります。',
  en: 'When `paramsSchema` accepts a locale, it sets that locale for the rest of the caller’s async context. Called directly from a test, it leaves that locale set for the tests that follow.',
});

export const schemaRun = message({
  ja: 'ロケールを受け付ける検証は`run`の中で呼びます。`run`を抜けるとロケールは元に戻り、後のテストには残りません。',
  en: 'Validate a locale that should be accepted inside `run`. The locale is restored when `run` returns, so it does not reach the tests after it.',
});

export const schemaRefused = message({
  ja: '一覧に無いロケールは受け付けず、ロケールも設定されません。そのため`run`で囲まなくてかまいません。',
  en: 'A locale outside the list is refused and sets nothing, so that call needs no `run`.',
});

export const browserTitle = message({
  ja: 'ブラウザのテスト',
  en: 'Tests in a browser',
});

export const browserUrl = message({
  ja: 'Vitestのブラウザモードのような本物のブラウザでは、`location.pathname`の先頭の区間がロケールになります。`history.replaceState`でパスを書き換え、`afterEach`で元に戻します。',
  en: 'In a real browser, such as Vitest’s browser mode, the first segment of `location.pathname` is the locale. Change it with `history.replaceState`, and restore it in `afterEach`.',
});

export const browserRun = message({
  ja: 'ブラウザで`run`を呼ぶと、`locales.run: in the browser the URL is the locale — navigate instead`というエラーになります。jsdomやhappy-domのように`document`を定義する環境もブラウザとして扱うので、同じようにURLでロケールを決めます。',
  en: 'Calling `run` in a browser fails with `locales.run: in the browser the URL is the locale — navigate instead`. An environment that defines `document`, such as jsdom or happy-dom, counts as a browser, so set the locale with the URL there too.',
});

export const setTitle = message({
  ja: 'テストの中の`defineLocales`',
  en: '`defineLocales` inside a test',
});

export const setLastWins = message({
  ja: 'テストの中で`defineLocales`を呼ぶと、文言が読む集合は最後に定義したものに置き換わります。',
  en: 'Calling `defineLocales` in a test replaces the set every message reads; the last one defined wins.',
});

export const setFix = message({
  ja: 'テストではアプリの`locales`をimportして使います。別の集合を定義するテストがあるなら、セットアップファイルの`beforeEach`でアプリの集合を定義し直します。',
  en: 'Tests import the app’s `locales`. If some test defines a set of its own, define the app’s set again in a `beforeEach` in the setup file.',
});

export const typesTitle = message({
  ja: '型のテスト',
  en: 'Type tests',
});

export const typesPin = message({
  ja: '文言の引数の型と、ロケールが欠けたときの型エラーは、型のテストで確かめられます。',
  en: 'Type tests can check a message’s argument types and the type error for a missing locale.',
});

export const typesExpect = message({
  ja: '`@ts-expect-error`を付けた宣言は、ロケールが欠けて型エラーになる限り通ります。ロケールの型が`Register`に登録されずに型エラーが出なくなると、使われない`@ts-expect-error`が残り、型チェックが失敗します。',
  en: 'The declaration under `@ts-expect-error` passes as long as the missing locale is a type error. If `Register` stops carrying the locale type and the line compiles, the unused `@ts-expect-error` fails the type check.',
});
