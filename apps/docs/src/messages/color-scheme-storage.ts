import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '訪問者が選んだ配色は、`@k8ordo/state`のローカル状態としてlocalStorageに保存されます。保存される値の形と、プロバイダを通さずに読む方法が分かります。',
  en: 'The visitor’s choice is stored in localStorage as an `@k8ordo/state` local state. You will learn the stored shape and how to read it without the provider.',
});

export const definitionTitle = message({
  ja: '`colorSchemeState`の定義',
  en: 'The `colorSchemeState` definition',
});

export const definitionKeyCallout = message({
  ja: '状態の名前。localStorageのキーは`k8ordo-state:color-scheme`',
  en: 'The state’s name. The localStorage key is `k8ordo-state:color-scheme`',
});

export const definitionOptionalCallout = message({
  ja: '省略できる。無いときは「何も選んでいない」',
  en: 'Optional. Absent means “nothing chosen”',
});

export const definitionStateBefore = message({
  ja: '`@k8ordo/color-scheme`は保存先の定義を`colorSchemeState`としてexportしています。定義はこれですべてです。`defineLocalState`の仕組みは`@k8ordo/state`の',
  en: '`@k8ordo/color-scheme` exports this definition as `colorSchemeState`; there is nothing more to it. How `defineLocalState` works is covered in ',
});

export const definitionStateAfter = message({
  ja: 'を見てください。',
  en: ' in `@k8ordo/state`.',
});

export const definitionKey = message({
  ja: 'キーは`colorSchemeState.storageKey`で読めるので、文字列で書く必要はありません。',
  en: 'Read the key as `colorSchemeState.storageKey` instead of spelling it out.',
});

export const definitionOptional = message({
  ja: '初めて訪れたときのOSの設定が、選択として保存されることはありません。',
  en: 'The OS setting on the first visit is never stored as a choice.',
});

export const rowsTitle = message({
  ja: '保存される値',
  en: 'What is stored',
});

export const rowsWhen = message({
  ja: 'localStorageに書き込むのは、`setPreference`を呼んだときだけです。呼び方ごとに、保存される値は次のようになります。',
  en: 'localStorage is written only when `setPreference` is called. Here is what each call stores.',
});

export const rowsNever = message({
  ja: '一度も選んでいない：何も保存されていません。`localStorage.getItem`は`null`を返します。',
  en: 'Never chose: nothing is stored, and `localStorage.getItem` returns `null`.',
});

export const rowsDark = message({
  ja: '`setPreference(\'dark\')`：`{"preference":"dark"}`が保存されます。',
  en: '`setPreference(\'dark\')`: `{"preference":"dark"}` is stored.',
});

export const rowsLight = message({
  ja: '`setPreference(\'light\')`：`{"preference":"light"}`が保存されます。',
  en: '`setPreference(\'light\')`: `{"preference":"light"}` is stored.',
});

export const rowsSystem = message({
  ja: "`setPreference('system')`：`{}`が保存されます。",
  en: "`setPreference('system')`: `{}` is stored.",
});

export const rowsSame = message({
  ja: '`preference`の無い`{}`は、読む側には何も保存されていないのと同じです。どちらも「何も選んでいない」として読まれ、プロバイダの既定値が使われます。',
  en: 'When read, `{}` is the same as nothing stored. Both mean nothing chosen, and the provider’s default applies.',
});

export const rowsDefaultBefore = message({
  ja: '既定値は保存されません。`defaultPreference`を変えたときの動作は',
  en: 'The default is never stored. What changing `defaultPreference` does is covered in ',
});

export const rowsDefaultAfter = message({
  ja: 'を見てください。',
  en: '.',
});

export const readTitle = message({
  ja: 'プロバイダを通さない読み取り',
  en: 'Reading without the provider',
});

export const readHook = message({
  ja: "どのClient Componentでも、`useAppState(colorSchemeState)`でプロバイダと同じ値を読めます。返るのは保存した`preference`で、`'light'`か`'dark'`か`undefined`です。サーバーの描画とハイドレーションの描画では`undefined`です。",
  en: "Any Client Component reads the same value as the provider with `useAppState(colorSchemeState)`. It returns the stored `preference`: `'light'`, `'dark'` or `undefined`. In the server render and the hydration render, it is `undefined`.",
});

export const readScheme = message({
  ja: '画面に適用中の配色を読むときは、`useColorScheme()`の`scheme`を使います。',
  en: 'For the scheme currently applied, use `scheme` from `useColorScheme()`.',
});

export const readInlineBefore = message({
  ja: '最初の描画の前に動く自前のインラインスクリプトでは、`colorSchemeState.inlineRead()`を使います。返るのは、保存した値か`null`になるJavaScriptの式です。スキーマは通らないので、使うフィールドは自分で確かめます。詳しくは`@k8ordo/state`の',
  en: 'An inline script of your own that runs before the first paint uses `colorSchemeState.inlineRead()`. It returns a JavaScript expression that evaluates to the stored object or `null`. No schema runs there, so check each field you use. See ',
});

export const readInlineAfter = message({
  ja: 'を見てください。',
  en: ' in `@k8ordo/state`.',
});

export const tabsTitle = message({
  ja: 'ほかのタブとの同期',
  en: 'Syncing across tabs',
});

export const tabsSync = message({
  ja: '別のタブで選び直した配色は、`storage`イベントでこのタブのプロバイダにも反映されます。`<html>`のクラスもその場で変わります。別のタブでlocalStorageを消した場合も同じです。',
  en: 'A choice made in another tab reaches this tab’s provider through the `storage` event, and the class on `<html>` changes in place. The same happens when another tab clears localStorage.',
});

export const tabsSameTab = message({
  ja: '`storage`イベントは、書き込んだタブ自身では発火しません。同じタブで`localStorage.setItem`を直接呼んでも、再読み込みするまでプロバイダには反映されません。選択を変えるときは`setPreference`を使います。',
  en: 'The `storage` event does not fire in the tab that wrote. A direct `localStorage.setItem` in the same tab is not reflected in the provider until a reload. Change the choice through `setPreference`.',
});

export const besideTitle = message({
  ja: 'ほかの設定',
  en: 'Other preferences',
});

export const besideOwnBefore = message({
  ja: 'ほかの表示の設定は、別の名前で定義した自前の`defineLocalState`に保存します。書き方は`@k8ordo/state`の',
  en: 'Store other display preferences in a `defineLocalState` of your own under another name. See ',
});

export const besideOwnAfter = message({
  ja: 'を見てください。',
  en: ' in `@k8ordo/state`.',
});

export const besideCollision = message({
  ja: "アプリの中で`defineLocalState('color-scheme', …)`をもう1つ定義しないでください。ストアは名前で共有されるので、2つの定義が同じlocalStorageのキーを読み書きします。",
  en: "Do not define another `defineLocalState('color-scheme', …)` in the application. Stores are shared by name, so both definitions read and write the same localStorage key.",
});
