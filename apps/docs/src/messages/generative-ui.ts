import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'LLMに`@k8ordo/ui`のコンポーネントだけでUIを組み立てさせます。json-renderとOpenUIのどちらでも、プロンプトの生成から描画までをこのライブラリのアダプタで行えます。',
  en: 'Have an LLM build UI out of `@k8ordo/ui` components only. With json-render or OpenUI, the adapters in this library cover everything from the prompt to the rendering.',
});

export const installTitle = message({
  ja: 'インストール',
  en: 'Install',
});

export const installDescription = message({
  ja: 'json-renderとOpenUIのうち、使うほうのパッケージをzodと一緒に入れます。',
  en: 'Install zod and the packages for whichever you use, json-render or OpenUI.',
});

export const installSeries = message({
  ja: (jsonRender: string, openUi: string) =>
    `どちらも0.x系で、マイナーバージョンが上がると互換性が変わります。対応するバージョンはjson-renderが${jsonRender}、OpenUIが${openUi}です。`,
  en: (jsonRender, openUi) =>
    `Both are 0.x, where a minor release can break compatibility. The supported versions are json-render ${jsonRender} and OpenUI ${openUi}.`,
});

export const installOneCopy = message({
  ja: 'アダプタはjson-renderやOpenUIが持つReactのコンテキストを読みます。アプリと`@k8ordo/ui`がそれぞれ別のバージョンを解決しても、型とビルドは通ります。それでも描画のときに、フォームのコンポーネントがエラーになります。OpenUIなら`useOpenUI must be used within a <Renderer /> component.`、json-renderなら`useStateStore must be used within a StateProvider`です。バージョンはアプリの中で1つにそろえます。',
  en: 'The adapters read the React context that json-render or OpenUI itself provides. If your app and `@k8ordo/ui` resolve different versions of it, the types and the build still pass. At render time, though, the form components fail: OpenUI with `useOpenUI must be used within a <Renderer /> component.`, json-render with `useStateStore must be used within a StateProvider`. Keep one version in the app.',
});

export const promptTitle = message({
  ja: 'プロンプトの生成',
  en: 'Prompt generation',
});

export const promptServer = message({
  ja: '`@k8ordo/ui/json-render`はサーバーで読み込めます。Server Componentやサーバーの処理から`catalog.prompt()`を呼べます。',
  en: '`@k8ordo/ui/json-render` loads on the server. A Server Component or any server code can call `catalog.prompt()`.',
});

export const promptRules = message({
  ja: '`uiRules`は、表の各行にセルを列の数だけ置くといった、LLMが破りやすい約束事の一覧です。`customRules`に渡すと、プロンプトに書き足されます。',
  en: '`uiRules` lists the rules a model most often breaks, such as giving a table row as many cells as there are columns. Pass them as `customRules` and they are added to the prompt.',
});

export const promptLanguage = message({
  ja: 'アダプタがLLMに渡す説明は、アプリのロケールに関係なくすべて英語です。UIに書かれる文の言語を決めたいときは、約束事を自分で足します。',
  en: 'Everything the adapters hand the model is English, whatever the application’s locale. To set the language of the text written into the UI, add a rule of your own.',
});

export const promptLanguageCallout = message({
  ja: 'UIの文の言語を決める約束事',
  en: 'A rule that sets the language of the UI text',
});

export const renderTitle = message({
  ja: 'ブラウザでの描画',
  en: 'Rendering in the browser',
});

export const renderDescription = message({
  ja: '`JsonRenderUI`はjson-renderのプロバイダ、レンダラー、コンポーネントの登録を1つにまとめたコンポーネントです。`spec`を渡すだけで描けます。',
  en: '`JsonRenderUI` bundles json-render’s provider, its renderer and the component registry. Passing the `spec` is all it takes.',
});

export const renderStateChange = message({
  ja: 'フォームの値を集めるときは`onStateChange`を渡します。変わった`path`と`value`の配列を受け取ります。',
  en: 'To collect form values, pass `onStateChange`. It receives an array of the changed `path` and `value` pairs.',
});

export const validateTitle = message({
  ja: '出力の検証',
  en: 'Validating the output',
});

export const validateDescription = message({
  ja: '`validateGeneratedSpec`は、機械的に直せる誤りを直してから、specの構造とコンポーネントごとのpropsを確かめます。通れば`spec`を返します。',
  en: '`validateGeneratedSpec` fixes what can be fixed mechanically, then checks the spec’s structure and each component’s props. When the spec passes, it returns the `spec`.',
});

export const validateRepair = message({
  ja: '通らなければ、見つけた誤りの一覧`issues`と、それをもとに作った`repairPrompt`を返します。`repairPrompt`はLLMにそのまま送り返せる文章です。',
  en: 'When it does not, it returns the `issues` it found and a `repairPrompt` built from them. The `repairPrompt` can be sent straight back to the model.',
});

export const typedTitle = message({
  ja: 'specの型',
  en: 'Typed specs',
});

export const typedDescription = message({
  ja: '自分でspecを書くときは、`satisfies UISpec`を付けます。コンポーネントの名前やpropsを打ち間違えると、型エラーになります。',
  en: 'When you write a spec by hand, add `satisfies UISpec`. A misspelt component name or prop becomes a type error.',
});

export const openuiTitle = message({
  ja: 'OpenUI',
  en: 'OpenUI',
});

export const openuiDescription = message({
  ja: 'OpenUIは、LLMが書いた文字列を`library`で描きます。描画はClient Componentで行います。',
  en: 'OpenUI renders the model’s output string with `library`. Rendering happens in a Client Component.',
});

export const openuiPrompt = message({
  ja: 'プロンプトは`@k8ordo/ui/openui/prompt`の`prompt()`で作ります。この入口はReactに依存しないので、サーバーで呼べます。UIの文の言語を決める約束事は`additionalRules`に渡します。',
  en: 'The prompt comes from `prompt()` in `@k8ordo/ui/openui/prompt`. That entry does not depend on React, so it runs on the server. A rule that sets the language of the UI text goes in `additionalRules`.',
});
