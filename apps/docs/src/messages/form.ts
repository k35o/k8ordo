import { message } from '@k8ordo/i18n';

export const description = message({
  ja: 'zodスキーマ1つから、HTMLの制約属性・エラーメッセージ・サーバー検証を導きます。値はDOMが持つので、JavaScriptが落ちていても読み込み前でもフォームは動きます。',
  en: 'One zod schema produces the HTML constraint attributes, the messages, and the server-side validation. The DOM holds the values, so the form works with JavaScript disabled or not yet loaded.',
});

export const featuresTitle = message({
  ja: '特徴',
  en: 'Features',
});

export const featureSchema = message({
  ja: '出所はスキーマ1つ',
  en: 'One source: the schema',
});

export const featureSchemaDescription = message({
  ja: 'required も maxLength も type も、書いたスキーマから降ってきます。JSXとサーバーに同じ制約を二重に書く必要がありません。',
  en: 'required, maxLength and type all come from the schema you wrote. No writing the same constraint twice, once in JSX and once on the server.',
});

export const featureNoJs = message({
  ja: 'JavaScriptが無くても動く',
  en: 'Works without JavaScript',
});

export const featureNoJsDescription = message({
  ja: '送信は Server Action が受けます。エラーはフィールド単位で返り、入力値も戻るので、やり直しで打ち直しになりません。',
  en: 'A Server Action receives the submission. Errors come back per field and so do the values, so a retry never means typing it all again.',
});

export const featureDom = message({
  ja: '値はDOMが持つ',
  en: 'The DOM holds the values',
});

export const featureDomDescription = message({
  ja: '入力のたびに再描画が起きません。値がReactのstateに載ることはなく、載るのは表示中のエラーや行の識別子といった、DOMが表現できないものだけです。',
  en: 'Typing does not re-render on every keystroke. Values never enter React state — it carries only what the DOM cannot express, like the messages on screen and the identity of each row.',
});

export const featureTypes = message({
  ja: 'パスが型で守られる',
  en: 'Paths are checked by the compiler',
});

export const featureTypesDescription = message({
  ja: "`field('titel')` のような打ち間違いは、動かす前にコンパイルが止めます。ネストしたパスも配列との取り違えも同じように落ちます。",
  en: "A typo like `field('titel')` fails the build rather than the click. Nested paths and arrays are distinguished the same way.",
});

export const featureLoud = message({
  ja: '黙って壊れない',
  en: 'Never breaks in silence',
});

export const featureLoudDescription = message({
  ja: 'スキーマにある欄が送信されていなければ、検証の失敗ではなく結線の誤りとして知らせます。スキーマ全体に付けた `.refine()` など、制約属性に落ちなかった検証も一覧で報告します。欄・入れ子のオブジェクト・繰り返し行に付けた `.refine()` など、まだ一覧に載らない検証もあります。',
  en: 'A field in the schema that never arrived is reported as a wiring mistake, not a validation failure. Checks that could not become attributes, such as a `.refine()` on the whole schema, are listed too. Some are not listed yet, such as a `.refine()` on a single field, a nested object or a row.',
});

export const featureSecrets = message({
  ja: '秘密は返さない',
  en: 'Secrets are never echoed',
});

export const featureSecretsDescription = message({
  ja: 'やり直しのために入力値を返しますが、パスワード欄は自動で除きます。属性を生成したのがform自身なので、指定を書き忘れる事故が起きません。',
  en: 'Values come back so a retry keeps the input, with password fields excluded automatically — the library generated the attributes, so it knows which ones they are.',
});

export const docsTitle = message({
  ja: 'ドキュメント',
  en: 'Documentation',
});

export const docsDescription = message({
  ja: '設計ガイドは npm パッケージに同梱されています。AIコーディングエージェントは `node_modules/@k8ordo/form/docs/` からインストールした版そのものを読みます。',
  en: 'The guide ships inside the npm package. An AI coding assistant reads the exact installed version out of `node_modules/@k8ordo/form/docs/`.',
});

export const demoTitle = message({
  ja: 'このページで動いています',
  en: 'Running on this very page',
});

export const demoDescription = message({
  ja: '下のフォームは GET で送信し、この URL の search params に着地します。制約属性は Server Component で `formFields(demoState.url)` が導いたもので、同じスキーマを @k8ordo/state の `definePageState` が読み返します。フォームが書いた URL と state が読んだ値が一致していることを、下の行で確かめられます。',
  en: 'The form below submits as GET and lands in this URL’s search params. Its constraint attributes were derived by `formFields(demoState.url)` in a Server Component, and the same schema is what @k8ordo/state’s `definePageState` reads back. The row underneath shows the URL the form wrote and the values state read agreeing.',
});

export const demoLabelQ = message({
  ja: 'キーワード',
  en: 'Keyword',
});

export const demoLabelMin = message({
  ja: '最小値',
  en: 'Minimum',
});

export const demoSubmit = message({
  ja: '絞り込む',
  en: 'Filter',
});

export const demoUrlEmpty = message({
  ja: 'クエリなし（すべて default）',
  en: 'no query (all defaults)',
});

export const demoHint = message({
  ja: 'このサイトは @k8ordo/static で焼かれているので Server Action はありません。GET フォームは本体を持たないのでルーターが intercept し、同じ pathname への遷移は状態の更新として扱われます。JavaScript を切っても、同じフォームが同じ URL に着きます。`min` に -1 を入れて欄を離れると、スキーマと同じ文言のエラーが出ます。JavaScript が無ければ、ブラウザ自身の制約検証がブラウザの文言で送信を止めます。',
  en: 'This site is built with @k8ordo/static, so there is no Server Action. A GET form carries no body, so the router intercepts it, and a navigation to the same pathname is a state update. With JavaScript off, the same form lands on the same URL. Type -1 into `min` and leave the field, and the error appears in the schema’s own words. Without JavaScript, the browser’s own constraint validation stops the submission, in the browser’s words.',
});
