import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'LLMにUIを作らせると、ブランドから外れた色や存在しない部品が混ざりがちです。`@k8ordo/ui`には、LLMがこのライブラリの部品だけでUIを組み立てるためのアダプタがあり、json-renderとOpenUIの2つに対応しています。プロンプトはサーバーで作り、返ってきた出力を確かめてから、ブラウザで描きます。',
  en: 'A model left to build UI tends to reach for off-brand colours and components that do not exist. `@k8ordo/ui` ships adapters that let it build UI out of this library’s components only, for json-render and for OpenUI. Generate the prompt on the server, check what comes back, then render it in the browser.',
});

export const promptTitle = message({
  ja: 'プロンプトをサーバーで作る',
  en: 'Generate the prompt on the server',
});

export const promptDescription = message({
  ja: '`@k8ordo/ui/json-render`はサーバーで読み込んでよい入口なので、Server Componentやサーバーの処理から`catalog`を呼べます。`uiRules`は、表の列とセルの数をそろえるといった、LLMが破りやすい約束事をまとめたものです。`customRules`に渡すと、プロンプトに書き足されます。',
  en: '`@k8ordo/ui/json-render` is safe to load on the server, so a Server Component or any server code can call `catalog`. `uiRules` collects the conventions a model most often breaks, such as giving a table row as many cells as it has columns. Pass them as `customRules` and they are written into the prompt.',
});

export const promptLanguage = message({
  ja: 'アダプタがLLMに渡す説明は、アプリのロケールに関係なくすべて英語です。読むのはLLMで、利用者の目には触れないからです。UIに書かれる文の言語を決めたいときは、`Write all UI text in Japanese.`のような約束事を自分で足します。',
  en: 'Everything the adapters hand the model is English, whatever your application’s locale: the model reads it and your users never see it. To pin the language of the text the model writes into the UI, add a rule of your own such as `Write all UI text in Japanese.`',
});

export const renderTitle = message({
  ja: 'ブラウザで描く',
  en: 'Render in the browser',
});

export const renderDescription = message({
  ja: '`JsonRenderUI`は、json-renderのプロバイダと描画の仕組み、部品の登録をまとめたものです。そのため、specを渡すだけで描けます。',
  en: '`JsonRenderUI` bundles json-render’s provider, its renderer and the component registry, so passing the spec is all it takes.',
});

export const validateTitle = message({
  ja: 'LLMの出力を確かめて直させる',
  en: 'Check the model’s output and have it repaired',
});

export const validateDescription = message({
  ja: '`validateGeneratedSpec`は、機械的に直せる誤りを直してから、specの構造と部品ごとのpropsを確かめます。通れば`spec`を返し、通らなければ、見つけた誤りから作った`repairPrompt`を返します。これはLLMにそのまま送り返せる文章です。',
  en: '`validateGeneratedSpec` fixes what can be fixed mechanically, then checks the spec’s structure and each component’s props. It returns the `spec` when it passes, and otherwise a `repairPrompt` built from what it found, ready to send straight back to the model.',
});

export const typedTitle = message({
  ja: 'specを型で確かめる',
  en: 'Type-check a spec',
});

export const typedDescription = message({
  ja: '自分でspecを書くときは、`satisfies UISpec`を付けます。部品の名前やpropsを打ち間違えると、型エラーになります。',
  en: 'When you write a spec by hand, add `satisfies UISpec`, and a misspelt component name or prop fails to compile.',
});

export const openuiTitle = message({
  ja: 'OpenUIで使う',
  en: 'Use OpenUI',
});

export const openuiDescription = message({
  ja: 'OpenUIは、LLMが書いた文字列を`library`で描きます。描画はClient Componentで行います。',
  en: 'OpenUI renders the string the model wrote with `library`, in a Client Component.',
});

export const openuiPrompt = message({
  ja: 'プロンプトは`@k8ordo/ui/openui/prompt`の`prompt()`で作ります。この入口はReactに依存しないので、json-renderの`catalog.prompt()`と同じくサーバーで呼べます。',
  en: 'The prompt comes from `prompt()` in `@k8ordo/ui/openui/prompt`. That entry does not depend on React, so like json-render’s `catalog.prompt()` it runs on the server.',
});
