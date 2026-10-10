import { message } from '@k8ordo/i18n';

export const tagline = message({
  ja: 'zodのスキーマからHTMLの制約属性とサーバーの検証を作るReactのフォームライブラリ',
  en: 'A React form library that derives HTML constraint attributes and server-side validation from a zod schema',
});

export const claimSchemaTitle = message({
  ja: 'スキーマに1度だけ書く制約',
  en: 'Constraints written once, in the schema',
});

export const claimSchemaBody = [
  message({
    ja: '`formFields`はスキーマから、`required`や`maxlength`といった入力欄の属性とzodのエラー文言を作ります。',
    en: 'From the schema, `formFields` derives the input attributes (such as `required` and `maxlength`) and zod’s error messages.',
  }),
  message({
    ja: '`parseForm`は、送信された`FormData`を同じスキーマで検証します。JSXとサーバーに制約を書き写すことはありません。',
    en: '`parseForm` checks the submitted `FormData` against the same schema. No constraint is copied into JSX or the server.',
  }),
] as const;

export const claimNoJsTitle = message({
  ja: 'JavaScriptの読み込み前に動く検証',
  en: 'Validation before JavaScript loads',
});

export const claimNoJsBody = [
  message({
    ja: '制約は、サーバーが返すHTMLに属性として入っています。ページの読み込みが終わる前から、ブラウザが入力を確かめます。',
    en: 'The constraints are attributes in the server-rendered HTML, so the browser checks the input before the page finishes loading.',
  }),
  message({
    ja: '読み込みが終わると、入力欄から離れたときと送信のときに、同じスキーマで検証してzodのエラー文言を表示します。入力した値はReactのstateに保存しないので、キー入力のたびに再描画されることはありません。',
    en: 'Once the page has loaded, leaving a field and submitting both run the same schema check and show zod’s error messages. Values are not kept in React state, so typing does not re-render on every keystroke.',
  }),
] as const;

export const claimServerTitle = message({
  ja: '入力欄ごとに出るサーバーのエラー',
  en: 'Server errors shown on their fields',
});

export const claimServerBody = [
  message({
    ja: '`parseForm`は、検証に失敗した理由を入力欄ごとのエラーとして返します。送信された値も一緒に返します。',
    en: '`parseForm` returns each failure keyed by its field, together with the submitted values.',
  }),
  message({
    ja: '`useForm`はエラーを該当する入力欄に表示し、最初に失敗した入力欄へフォーカスを移します。入力した値は残るので、直してすぐに送り直せます。',
    en: '`useForm` shows each error on its field and moves focus to the first field that failed. What was typed stays, ready to be fixed and sent again.',
  }),
] as const;

export const demoTitle = message({
  ja: '絞り込みフォームのデモ',
  en: 'Filter form demo',
});

export const demoDescription = message({
  ja: 'スキーマから作ったGETのフォームで、送信するとこのページのURLが書き換わります。',
  en: 'A GET form derived from a schema; submitting it rewrites this page’s URL.',
});

export const demoSteps = [
  message({
    ja: '「最小値」に`-1`と入力して入力欄から離れると、zodのエラー文言が表示されます。',
    en: 'Type `-1` into “Minimum” and leave the field. zod’s error message appears.',
  }),
  message({
    ja: 'そのまま「絞り込む」を押すと、送信が止まり、フォーカスがその入力欄に戻ります。',
    en: 'Press “Filter” anyway. The submission stops, and focus returns to that field.',
  }),
  message({
    ja: '正しい値にして送ると、URLとその下の`state`に同じ値が表示されます。',
    en: 'Submit valid values. The URL and the `state` below it show the same values.',
  }),
] as const;

export const demoLabelQ = message({
  ja: 'キーワード',
  en: 'Keyword',
});

export const demoLabelMin = message({
  ja: '最小値',
  en: 'Minimum',
});

export const demoLabelInStock = message({
  ja: '在庫ありのみ',
  en: 'In stock only',
});

export const demoSubmit = message({
  ja: '絞り込む',
  en: 'Filter',
});

export const demoUrlEmpty = message({
  ja: 'クエリなし（すべて既定値）',
  en: 'No query (all defaults)',
});

export const navFieldTypes = message({
  ja: '入力欄の種類',
  en: 'Field types',
});

export const navNested = message({
  ja: '入れ子と繰り返し行',
  en: 'Nested and repeated rows',
});

export const navRules = message({
  ja: '複数の入力欄の検証',
  en: 'Cross-field rules',
});

export const navEdit = message({
  ja: '既存データの編集',
  en: 'Editing',
});

export const navAsyncCheck = message({
  ja: 'サーバーへの問い合わせ',
  en: 'Async checks',
});

export const navCustomInputs = message({
  ja: '独自の入力部品',
  en: 'Custom inputs',
});

export const navMultiStep = message({
  ja: '複数ステップのフォーム',
  en: 'Multi-step forms',
});

export const navSearch = message({
  ja: '検索フォーム',
  en: 'Search forms',
});

export const navHowItWorks = message({
  ja: '仕組み',
  en: 'How it works',
});

export const navErrors = message({
  ja: 'エラーの表示',
  en: 'Errors',
});

export const navReferenceSchema = message({
  ja: 'スキーマの対応',
  en: 'Schema mapping',
});

export const navTroubleshooting = message({
  ja: 'トラブルシューティング',
  en: 'Troubleshooting',
});

export const navReferenceServer = message({
  ja: 'サーバーAPI',
  en: 'Server API',
});

export const navReferenceClient = message({
  ja: 'クライアントAPI',
  en: 'Client API',
});
