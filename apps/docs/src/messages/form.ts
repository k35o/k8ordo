import { message } from '@k8ordo/i18n';

export const tagline = message({
  ja: 'zodスキーマ1つで、ブラウザとサーバーの検証をそろえる。',
  en: 'One zod schema validates your form in the browser and on the server.',
});

export const claimSchemaTitle = message({
  ja: '制約はスキーマに1度だけ書く',
  en: 'Write each constraint once, in the schema',
});

export const claimSchemaBody = [
  message({
    ja: 'スキーマから、`required`や`maxlength`などの属性と、zodのエラー文言を導きます。',
    en: 'The schema gives you the input attributes, such as `required` and `maxlength`, along with zod’s own error messages.',
  }),
  message({
    ja: '送信を受けたサーバーも、同じスキーマで検証します。JSXとサーバーに同じ制約を書き写す必要はありません。',
    en: 'The server checks the submission against the same schema, so no constraint is written twice.',
  }),
] as const;

export const claimNoJsTitle = message({
  ja: 'JavaScriptが届く前から検証が効く',
  en: 'Validation works before JavaScript arrives',
});

export const claimNoJsBody = [
  message({
    ja: '制約はサーバーが描くHTMLの属性なので、読み込みの途中でもブラウザが入力を確かめます。',
    en: 'Constraints are attributes in the server-rendered HTML, so the browser checks input while the page is still loading.',
  }),
  message({
    ja: '読み込みが済むと、同じ検査をzodの文言で行います。値はDOMが持つので、入力のたびに再描画されることはありません。',
    en: 'Once the page is hydrated, the same checks run with zod’s wording. Values stay in the DOM, so typing never re-renders.',
  }),
] as const;

export const claimServerTitle = message({
  ja: 'サーバーのエラーは欄に戻る',
  en: 'Server errors land on their fields',
});

export const claimServerBody = [
  message({
    ja: '`parseForm`は、失敗を欄ごとのエラーとして返します。',
    en: '`parseForm` returns each failure keyed by its field.',
  }),
  message({
    ja: '`useForm`はそれを該当する欄に表示し、最初に失敗した欄へフォーカスを移します。入力した値は残るので、直してすぐに送り直せます。',
    en: '`useForm` shows it on that field and moves focus to the first one that failed. What the person typed is kept, so they can fix it and send again.',
  }),
] as const;

export const nextGetStarted = message({
  ja: 'スキーマを書いてから送信を受け取るまでを、一通り作ります。',
  en: 'Build a form end to end, from the schema to the submission.',
});

export const nextFieldTypes = message({
  ja: 'テキスト、数値、選択肢、チェックボックス、ファイルの欄を作ります。',
  en: 'Text, numbers, choices, checkboxes and files.',
});

export const nextErrors = message({
  ja: 'エラーを欄に表示し、失敗した欄へフォーカスを移します。',
  en: 'Show errors on their fields, and move focus to the first failure.',
});

export const nextReferenceServer = message({
  ja: '`formFields`、`parseForm`、`defineForm`とルールの一覧です。',
  en: '`formFields`, `parseForm`, `defineForm` and the rules.',
});

export const demoTitle = message({
  ja: '検索フォームを試す',
  en: 'Try a search form',
});

export const demoDescription = message({
  ja: 'スキーマから導いたGETのフォームです。送信すると、このページのURLが変わります。',
  en: 'A GET form derived from a schema. Submitting it changes this page’s URL.',
});

export const demoSteps = [
  message({
    ja: '「最小値」に`-1`を入れて欄を離れると、スキーマの文言でエラーが出ます。',
    en: 'Type `-1` into “Minimum” and leave the field. The error is the schema’s message.',
  }),
  message({
    ja: 'そのまま「絞り込む」を押すと送信は止まり、フォーカスが欄に戻ります。',
    en: 'Press “Filter” anyway. The submission stops and focus returns to the field.',
  }),
  message({
    ja: '正しい値で送ると、URLとstateの行に同じ値が出ます。',
    en: 'Submit valid values. The URL and the state line show the same values.',
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
  en: 'Nested objects and rows',
});

export const navErrors = message({
  ja: 'エラーを表示する',
  en: 'Show errors',
});

export const navReferenceServer = message({
  ja: 'サーバーAPI',
  en: 'Server API',
});

export const navReferenceClient = message({
  ja: 'クライアントAPI',
  en: 'Client API',
});
