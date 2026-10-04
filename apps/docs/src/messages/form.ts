import { message } from '@k8ordo/i18n';

export const tagline = message({
  ja: 'zodのスキーマを1つ書くだけで、ブラウザとサーバーの検証がそろうフォームのライブラリ。',
  en: 'One zod schema validates your form in the browser and on the server.',
});

export const claimSchemaTitle = message({
  ja: '制約はスキーマに1度だけ書く',
  en: 'Write each constraint once, in the schema',
});

export const claimSchemaBody = [
  message({
    ja: 'スキーマからは、`required`や`maxlength`といった入力欄の属性と、zodのエラー文言が作られます。',
    en: 'The schema gives you the input attributes, such as `required` and `maxlength`, along with zod’s own error messages.',
  }),
  message({
    ja: '送信を受け取ったサーバーも、同じスキーマで検証します。JSXとサーバーの両方に同じ制約を書き写す必要はありません。',
    en: 'The server checks the submission against the same schema, so no constraint is written twice.',
  }),
] as const;

export const claimNoJsTitle = message({
  ja: 'JavaScriptが届く前から入力を確かめる',
  en: 'Validation works before JavaScript arrives',
});

export const claimNoJsBody = [
  message({
    ja: '制約はサーバーが描いたHTMLの属性に入っているので、ページの読み込みが終わる前からブラウザが入力を確かめます。',
    en: 'Constraints are attributes in the server-rendered HTML, so the browser checks input while the page is still loading.',
  }),
  message({
    ja: '読み込みが終わると、同じ検証をzodの文言で行います。値はDOMが持っているので、入力のたびに再描画されることもありません。',
    en: 'Once the page is hydrated, the same checks run with zod’s wording. Values stay in the DOM, so typing never re-renders.',
  }),
] as const;

export const claimServerTitle = message({
  ja: 'サーバーのエラーは入力欄に戻る',
  en: 'Server errors land on their fields',
});

export const claimServerBody = [
  message({
    ja: '`parseForm`は、検証に失敗した理由を入力欄ごとのエラーとして返します。',
    en: '`parseForm` returns each failure keyed by its field.',
  }),
  message({
    ja: '`useForm`はそのエラーを該当する入力欄に表示し、最初に失敗した欄へフォーカスを移します。入力した値も残るので、直してすぐに送り直せます。',
    en: '`useForm` shows it on that field and moves focus to the first one that failed. What the person typed is kept, so they can fix it and send again.',
  }),
] as const;

export const nextGetStarted = message({
  ja: 'スキーマを書いてから送信を受け取るまでを、一通り作ります。',
  en: 'Build a form end to end, from the schema to the submission.',
});

export const nextFieldTypes = message({
  ja: 'テキストや数値、選択肢、チェックボックス、ファイルの入力欄を作ります。',
  en: 'Text, numbers, choices, checkboxes and files.',
});

export const nextErrors = message({
  ja: 'エラーを入力欄に表示し、失敗した欄へフォーカスを移します。',
  en: 'Show errors on their fields, and move focus to the first failure.',
});

export const nextReferenceServer = message({
  ja: '`formFields`と`parseForm`、`defineForm`、ルールの一覧です。',
  en: '`formFields`, `parseForm`, `defineForm` and the rules.',
});

export const nextNested = message({
  ja: 'オブジェクトの中の入力欄と、行を足したり消したりできる配列を扱います。',
  en: 'Fields inside objects, and arrays whose rows can be added and removed.',
});

export const nextReferenceClient = message({
  ja: '`useForm`と、それが返す値、`useAsyncCheck`、`HiddenValue`の一覧です。',
  en: '`useForm` and what it returns, `useAsyncCheck`, and `HiddenValue`.',
});

export const demoTitle = message({
  ja: '絞り込みのフォームを試す',
  en: 'Try a search form',
});

export const demoDescription = message({
  ja: 'スキーマから作ったGETのフォームです。送信すると、このページのURLが書き換わります。',
  en: 'A GET form derived from a schema. Submitting it changes this page’s URL.',
});

export const demoSteps = [
  message({
    ja: '「最小値」に`-1`と入力して欄から離れると、スキーマに書いた文言でエラーが出ます。',
    en: 'Type `-1` into “Minimum” and leave the field. The error is the schema’s message.',
  }),
  message({
    ja: 'そのまま「絞り込む」を押すと、送信が止まり、フォーカスが入力欄に戻ります。',
    en: 'Press “Filter” anyway. The submission stops and focus returns to the field.',
  }),
  message({
    ja: '正しい値にして送ると、URLとstateの行に同じ値が表示されます。',
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

export const navRules = message({
  ja: '複数の入力欄にまたがる検証',
  en: 'Cross-field rules',
});

export const navEdit = message({
  ja: '既存のデータを編集する',
  en: 'Edit existing data',
});

export const navAsyncCheck = message({
  ja: '入力中にサーバーへ問い合わせる',
  en: 'Check with the server',
});

export const navCustomInputs = message({
  ja: '独自の入力部品の値を送る',
  en: 'Custom inputs',
});

export const navMultiStep = message({
  ja: '複数ステップのフォーム',
  en: 'Multi-step forms',
});

export const navSearch = message({
  ja: '検索や絞り込みのフォーム',
  en: 'Search and filter forms',
});

export const navWithUi = message({
  ja: '@k8ordo/uiと組み合わせる',
  en: 'With @k8ordo/ui',
});

export const navHowItWorks = message({
  ja: '仕組み',
  en: 'How it works',
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
