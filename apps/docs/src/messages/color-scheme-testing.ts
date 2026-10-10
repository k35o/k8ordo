import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'Vitestのブラウザモードで、テストごとに状態を戻し、プロバイダの下でフックを描画して確かめられるようになります。',
  en: 'With Vitest’s browser mode, you reset the state before each test and render the hook under the provider to check it.',
});

export const resetTitle = message({
  ja: 'テストごとの初期化',
  en: 'Resetting between tests',
});

export const resetStorageCallout = message({
  ja: '前のテストで保存した選択を消す',
  en: 'Removes the preference an earlier test stored',
});

export const resetClassCallout = message({
  ja: 'プロバイダのeffectが付けたクラスを外す',
  en: 'Removes the class the provider’s effect added',
});

export const resetRegistryCallout = message({
  ja: '@k8ordo/stateのストアをリセットする',
  en: 'Resets the @k8ordo/state stores',
});

export const resetWhy = message({
  ja: 'localStorageと`<html>`のクラス、`@k8ordo/state`のストアは、どれもテストをまたいで残ります。ストアはキーごとに1つ作られ、`resetStateRegistry()`を呼ぶまで前のテストの値を保ちます。',
  en: 'localStorage, the class on `<html>` and the `@k8ordo/state` stores all persist across tests. A store is created once per key and keeps an earlier test’s values until `resetStateRegistry()` runs.',
});

export const resetUnmount = message({
  ja: '`resetStateRegistry()`は、フックを使うコンポーネントをアンマウントしてから呼びます。マウントされたままのフックは古いストアを持ち続けます。vitest-browser-reactなら、前のテストの描画は各テストの前に片付けられます。',
  en: 'Call `resetStateRegistry()` after every component using the hook is unmounted. A hook that stays mounted keeps its old store. With vitest-browser-react, the previous test’s render is cleaned up before each test.',
});

export const renderTitle = message({
  ja: 'フックの描画',
  en: 'Rendering the hook',
});

export const renderWrapper = message({
  ja: '`useColorScheme()`をプロバイダの外で呼ぶと、`useColorScheme needs <ColorSchemeProvider> above it`で始まるエラーになります。プロバイダを`renderHook`の`wrapper`に渡して描画します。',
  en: 'Calling `useColorScheme()` outside the provider throws an error starting with `useColorScheme needs <ColorSchemeProvider> above it`. Render it with the provider as `renderHook`’s `wrapper`.',
});

export const renderStorageKey = message({
  ja: 'localStorageのキーは、文字列で書かずに`colorSchemeState.storageKey`から読みます。キーの組み立て方は`@k8ordo/state`が決めます。',
  en: 'Read the localStorage key from `colorSchemeState.storageKey` instead of spelling it out. How the key is built is up to `@k8ordo/state`.',
});

export const changeTitle = message({
  ja: '選択の変更',
  en: 'Changing the preference',
});

export const changeWait = message({
  ja: '`setPreference`を呼んでも、その場では再描画されません。localStorageへの書き込みも同じタスクの終わりにまとめて行われ、再描画までには終わっています。',
  en: 'Calling `setPreference` does not re-render on the spot. The write to localStorage is batched to the end of the same task, and is done before the re-render.',
});

export const changeCheck = message({
  ja: '`scheme`か`preference`が変わるまで`vi.waitFor`で待ってから、保存した値とクラスを確かめます。',
  en: 'Wait with `vi.waitFor` until `scheme` or `preference` changes, then check the stored value and the class.',
});

export const changeSystemBefore = message({
  ja: "`'system'`に戻すと、保存した値は`{}`になります。`setPreference`に渡す値ごとの保存した値は",
  en: "Going back to `'system'` leaves `{}` as the stored value. What each `setPreference` value stores is listed in ",
});

export const changeSystemAfter = message({
  ja: 'にあります。',
  en: '.',
});

export const systemTitle = message({
  ja: 'OSがダークのブラウザ',
  en: 'Dark system preference',
});

export const systemResolve = message({
  ja: "`'system'`がどちらになるかは、テストを動かすブラウザの`prefers-color-scheme`で決まります。Playwrightで起動したブラウザは、指定しなければライトを好みます。`'system'`がOSの設定に従うことを確かめるときは、9行目の`colorScheme: 'dark'`でブラウザのほうをダークにします。",
  en: "What `'system'` resolves to depends on the test browser’s `prefers-color-scheme`. A browser Playwright launches prefers light unless told otherwise. To check that `'system'` follows the OS setting, make the browser dark with `colorScheme: 'dark'` on line 9.",
});

export const systemScope = message({
  ja: 'この設定は、そのブラウザで動くすべてのテストにかかります。既定値から始まることだけを確かめるなら、`defaultPreference="dark"`を渡したプロバイダを`wrapper`にすれば足ります。',
  en: 'The setting applies to every test that runs in that browser. To check only that the hook starts from the default, a `wrapper` whose provider gets `defaultPreference="dark"` is enough.',
});

export const scriptTitle = message({
  ja: 'インラインスクリプト',
  en: 'The inline script',
});

export const scriptNotRun = message({
  ja: 'テストのようにサーバーを通さずブラウザだけで描画すると、プロバイダのインラインスクリプトは実行されません。Reactは、ブラウザで自分が作ったインラインの`<script>`を実行しません。',
  en: 'When it renders only in the browser with no server render, as in a test, the provider’s inline script does not run. React never executes an inline `<script>` it creates in the browser.',
});

export const scriptConsole = message({
  ja: '開発ビルドのReactは、`Encountered a script tag while rendering React component`で始まるエラーをコンソールに出します。テストが失敗したわけではありません。',
  en: 'React’s development build logs an error to the console starting with `Encountered a script tag while rendering React component`. It does not mean the test failed.',
});

export const scriptClass = message({
  ja: 'テストで確かめる`<html>`のクラスは、プロバイダのeffectが付けたクラスです。スクリプトが最初の描画の前にクラスを付けることは、パッケージ側のテストで確かめています。',
  en: 'The class a test sees on `<html>` is the one the provider’s effect wrote. That the script adds the class before the first paint is covered by this package’s own tests.',
});
