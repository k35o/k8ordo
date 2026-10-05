import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`@k8ordo/color-scheme`は、localStorageと`<html>`のクラス、`matchMedia`を使います。どれもブラウザにしか無いので、テストもVitestのブラウザモードのような本物のブラウザで動かします。このページでは、テストの間で状態を戻す方法と、プロバイダの下でフックを描いて確かめる方法を説明します。',
  en: '`@k8ordo/color-scheme` uses localStorage, the class on `<html>` and `matchMedia`, which only a browser has, so its tests run in a real browser, such as Vitest’s browser mode. This page covers putting things back between tests, and rendering the hook under the provider to check what it does.',
});

export const resetTitle = message({
  ja: 'テストの間で状態を戻す',
  en: 'Reset between tests',
});

export const resetDescription = message({
  ja: 'プロバイダは、localStorageの行と`<html>`のクラス、`@k8ordo/state`のストアを読み書きします。どれもテストをまたいで残るので、各テストの前に3つとも戻します。',
  en: 'The provider reads and writes the localStorage row, the class on `<html>`, and an `@k8ordo/state` store. All three outlive a test, so put all three back before each one.',
});

export const resetStorage = message({
  ja: '`localStorage.clear()`：前のテストで保存した選択を消します。残っていると、次のテストは何も選んでいない状態から始まりません。',
  en: '`localStorage.clear()`: removes the choice an earlier test stored. Left there, the next test does not start from nothing chosen.',
});

export const resetClass = message({
  ja: "`classList.remove('dark')`：前のテストでプロバイダのeffectが付けたクラスを外します。",
  en: "`classList.remove('dark')`: takes off the class the provider’s effect put on in an earlier test.",
});

export const resetRegistry = message({
  ja: '`resetStateRegistry()`：`@k8ordo/state`のストアを捨てます。ストアはキーごとに1つ作られてテストをまたいで残るので、捨てないと前のテストの値を持ち続けます。',
  en: '`resetStateRegistry()`: drops `@k8ordo/state`’s stores. One is made per key and outlives a test, so without this it keeps an earlier test’s values.',
});

export const resetUnmount = message({
  ja: '`resetStateRegistry()`を呼ぶときは、フックを使うコンポーネントがアンマウントされている必要があります。マウントされたままのフックは、捨てたはずの古いストアを持ち続けるからです。vitest-browser-reactを使っていれば、前のテストの描画は各テストの前に片付けられます。',
  en: 'Call `resetStateRegistry()` with no component using the hook still mounted, because a mounted hook keeps the old store it was given. With vitest-browser-react, the previous test’s render is cleaned up before each test.',
});

export const renderTitle = message({
  ja: 'プロバイダの下でフックを描く',
  en: 'Render the hook under the provider',
});

export const renderDescription = message({
  ja: '`useColorScheme()`はプロバイダの外では例外を投げるので、プロバイダを`renderHook`の`wrapper`に渡して描きます。',
  en: '`useColorScheme()` throws outside the provider, so render it with the provider as `renderHook`’s `wrapper`.',
});

export const renderStorageKey = message({
  ja: 'localStorageのキーは、文字列で書かずに`colorSchemeState.storageKey`から読みます。キーの組み立て方を決めているのは`@k8ordo/state`だからです。',
  en: 'Read the localStorage key from `colorSchemeState.storageKey` rather than spelling it out: how the key is built is `@k8ordo/state`’s decision.',
});

export const changeTitle = message({
  ja: '選択を変えて確かめる',
  en: 'Change the choice and check',
});

export const changeDescription = message({
  ja: '`setPreference`で選択を変えたら、`vi.waitFor`で描き直しを待ってから確かめます。',
  en: 'After changing the choice with `setPreference`, wait for the re-render with `vi.waitFor` before checking.',
});

export const changeWhy = message({
  ja: '`setPreference`を呼んでも、その場では描き直されません。localStorageへの書き込みも、マイクロタスクにまとめてから行われます。描き直しが済めば書き込みも済んでいるので、`scheme`や`preference`が変わるのを待ってから、行とクラスを確かめます。',
  en: 'Calling `setPreference` does not re-render on the spot, and the write to localStorage is batched into a microtask. Once the re-render has happened the write has too, so wait for `scheme` or `preference` to change, then check the row and the class.',
});

export const changeSystem = message({
  ja: "`'system'`に戻したときは行が消えるのではなく、`preference`の無い`{}`が残ります。",
  en: "Going back to `'system'` does not remove the row: `{}` remains, with no `preference` in it.",
});

export const systemTitle = message({
  ja: 'OSがダークのブラウザで確かめる',
  en: 'Test against a dark system',
});

export const systemDescription = message({
  ja: "`'system'`がどちらに決まるかは、テストを動かすブラウザの`prefers-color-scheme`しだいです。Playwrightで起動したブラウザは、指定しなければライトを好みます。",
  en: "What `'system'` resolves to is the test browser’s `prefers-color-scheme`, and a browser Playwright launches prefers light unless told otherwise.",
});

export const systemDefault = message({
  ja: '既定値から始まることを確かめるだけなら、`defaultPreference="dark"`を渡したプロバイダを`wrapper`にすれば足ります。OSの設定に従うことそのものを確かめたいときは、ブラウザのほうをダークにします。',
  en: 'To check that a visitor starts from the default, a `wrapper` whose provider is given `defaultPreference="dark"` is enough. To check that it follows the OS itself, make the browser prefer dark.',
});

export const systemScope = message({
  ja: 'この設定は、そのブラウザで動くすべてのテストにかかります。',
  en: 'The setting applies to every test that runs in that browser.',
});

export const scriptTitle = message({
  ja: 'インラインスクリプトは走らない',
  en: 'The inline script does not run',
});

export const scriptDescription = message({
  ja: 'テストのようにブラウザの中だけで描くと、プロバイダが描くインラインスクリプトは実行されません。Reactは、ブラウザで自分が作ったインラインの`<script>`を実行しないからです。',
  en: 'Rendered only in the browser, as in a test, the provider’s inline script does not run: React never executes an inline `<script>` it creates in the browser.',
});

export const scriptConsole = message({
  ja: '開発ビルドのReactは、そのことをコンソールにエラーとして出します。`Encountered a script tag while rendering React component`で始まるメッセージですが、テストが失敗したわけではありません。',
  en: 'React’s development build logs this as an error in the console, starting with `Encountered a script tag while rendering React component`. It does not mean the test failed.',
});

export const scriptClass = message({
  ja: 'そのため、テストで確かめる`<html>`のクラスは、プロバイダのeffectが付けたものです。スクリプトが最初の描画の前にクラスを付けることは、このパッケージ自身のテストで確かめています。',
  en: 'So the class a test sees on `<html>` is the one the provider’s effect wrote. That the script puts the class on before the first paint is covered by this package’s own tests.',
});
