import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '文言や`getLocale()`がどのロケールを読むかは、テストが動く環境によって変わります。Nodeで動くテストではサーバーと同じく`locales.run`で、ブラウザで動くテストではURLでロケールを決めます。',
  en: 'Which locale messages and `getLocale()` read depends on where the test runs. A test under Node sets it with `locales.run`, as a server would; a test in a browser sets it with the URL.',
});

export const nodeTitle = message({
  ja: 'Nodeで動くテスト',
  en: 'Tests under Node',
});

export const nodeDescription = message({
  ja: '何も指名しなければ、文言は既定のロケールの文を返します。別のロケールで確かめたいときは、`locales.run`の中で呼びます。',
  en: 'With nothing naming a locale, a message returns the default locale’s text. To check another locale, call it inside `locales.run`.',
});

export const nodeAsync = message({
  ja: 'asyncの関数を渡しても、`await`をまたいでロケールは保たれます。同時に動く`run`どうしが混ざることもありません。',
  en: 'An async function keeps the locale across its awaits, and `run` calls running at the same time stay apart.',
});

export const schemaTitle = message({
  ja: '`paramsSchema`を確かめる',
  en: 'Test `paramsSchema`',
});

export const schemaDescription = message({
  ja: '`paramsSchema`がロケールを受け付けると、呼んだ非同期の流れの残り全体に、そのロケールが設定されます。フレームワークはパターンごとに流れを分けますが、テストから直接呼ぶと分かれません。',
  en: 'When `paramsSchema` accepts a locale, it sets it for the rest of the async flow that called it. The framework gives each pattern a flow of its own; a test calling it directly gets none.',
});

export const schemaRun = message({
  ja: 'そのため、受け付ける呼び出しは`run`で囲みます。設定したロケールは`run`を抜けると元に戻るので、後に続くテストに漏れません。一覧に無いロケールは受け付けないので、何も設定しません。',
  en: 'So wrap a call that accepts in `run`. The locale it sets goes away once `run` returns, and does not leak into the tests after it. A locale outside the list is refused, and sets nothing.',
});

export const browserTitle = message({
  ja: 'ブラウザで動くテスト',
  en: 'Tests in a browser',
});

export const browserDescription = message({
  ja: 'Vitestのブラウザモードのような本物のブラウザでは、URLがロケールです。`history.replaceState`でpathnameを変え、終わったら元に戻します。',
  en: 'In a real browser, such as Vitest’s browser mode, the URL is the locale. Change the pathname with `history.replaceState`, and put it back afterwards.',
});

export const browserRun = message({
  ja: 'ブラウザでは、`run`はエラーを投げます。jsdomやhappy-domのように`document`を定義する環境も、このパッケージにとってはブラウザなので、同じようにURLでロケールを決めます。',
  en: '`run` throws in a browser. An environment that defines `document`, such as jsdom or happy-dom, is a browser as far as this package is concerned, so set the locale with the URL there too.',
});

export const setTitle = message({
  ja: 'テストの中で集合を定義しない',
  en: 'Do not define a set in a test',
});

export const setDescription = message({
  ja: 'テストの中で`defineLocales`を呼ぶと、それ以降の文言はその集合を読みます。最後に定義した集合が使われるためです。',
  en: 'Call `defineLocales` in a test, and every message after it reads that set: the last set defined is the one used.',
});

export const setFix = message({
  ja: 'テストでは、アプリの`locales`をimportして使います。別の集合を定義するテストがあるなら、`beforeEach`でアプリの集合を定義し直します。',
  en: 'Tests import the app’s `locales`. If some test defines a set of its own, define the app’s set again in `beforeEach`.',
});

export const typesTitle = message({
  ja: '型の保証をテストに残す',
  en: 'Keep the type guarantees in tests',
});

export const typesDescription = message({
  ja: '文言の引数の型や、ロケールが欠けたときの型エラーは、型のテストで固定できます。',
  en: 'A message’s argument types, and the type error for a missing locale, can be pinned with type tests.',
});

export const typesExpect = message({
  ja: '`@ts-expect-error`を付けた宣言は、ロケールが欠けて型エラーになる限り通ります。`Register`の登録が外れて型エラーにならなくなると、型チェックが失敗します。',
  en: 'The declaration under `@ts-expect-error` passes as long as the missing locale is a type error. Should `Register` stop applying, so that it compiles, the type check fails.',
});
