import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'LLMに`@k8ordo/ui`のコンポーネントだけでUIを組み立てさせるためのカタログです。json-renderやOpenUIといった形式には依存しません。形式とのつなぎはアプリが持ちます。',
  en: 'A catalog for having an LLM build UI out of `@k8ordo/ui` components only. It depends on no format such as json-render or OpenUI; the glue to a format lives in your app.',
});

export const installTitle = message({
  ja: 'インストール',
  en: 'Install',
});

export const installDescription = message({
  ja: 'カタログに要るのはzodだけです。json-renderやOpenUIは、つなぎを置くアプリが入れます。',
  en: 'The catalog needs zod alone. json-render or OpenUI is installed by the app that keeps the glue.',
});

export const catalogTitle = message({
  ja: 'カタログ',
  en: 'The catalog',
});

export const catalogDescription = message({
  ja: '`catalog`は、コンポーネントの名前ごとに説明とpropsのスキーマを持ちます。子を並べるコンポーネントには`children`が、入力欄には`value`が付きます。',
  en: '`catalog` holds a description and a props schema for each component name. A component that lays out children has `children`, and a field has `value`.',
});

export const catalogValue = message({
  ja: '`value.prop`は値を持つpropの名前です。`value.initial(props)`は、何も結び付けないときの値です。',
  en: '`value.prop` names the prop that holds the value. `value.initial(props)` is the value when nothing is bound to it.',
});

export const catalogEvents = message({
  ja: '`events`は、アプリに伝える利用者の操作です。`Button`、`IconButton`、`Card`、`DropdownMenuItem`が`press`を持ちます。',
  en: '`events` lists what the user does that the application hears about. `Button`, `IconButton`, `Card`, and `DropdownMenuItem` have `press`.',
});

export const catalogServer = message({
  ja: '`@k8ordo/ui/catalog`はReactを読まないので、サーバーで読み込めます。Server Componentやサーバーの処理からプロンプトを作れます。',
  en: '`@k8ordo/ui/catalog` imports no React, so it loads on the server. A Server Component or any server code can build the prompt from it.',
});

export const renderTitle = message({
  ja: 'ブラウザでの描画',
  en: 'Rendering in the browser',
});

export const renderDescription = message({
  ja: '`renderers`は`catalog`と同じ名前で、コンポーネントの描き方を持ちます。スキーマに合うpropsと、形式が描いた子を渡します。',
  en: '`renderers` has the same names as `catalog` and draws each component. Pass props that fit the schema and the children the format drew.',
});

export const renderNull = message({
  ja: 'propsに`null`は入れません。OpenUI Langのように省いた値を`null`で書く形式もあるので、つなぎは`null`のキーを取り除きます。そのうえで項目のスキーマで確かめ、確かめた値を渡します。スキーマに合わない要素は描きません。`Table`の列のように、propsの中のオブジェクトに知らないキーがある要素も描きません。propsそのものに知らないキーがあれば、そのキーを取り除いて描きます。',
  en: 'The props hold no `null`. Some formats, such as OpenUI Lang, write an omitted value as `null`, so the glue drops those keys. It then parses the rest with the entry’s schema and passes what the parse returns. An element that does not fit is not drawn. Neither is an element with an unknown key inside an object in its props, such as a `Table` column. An unknown prop at the top is dropped, and the element is drawn without it.',
});

export const renderValue = message({
  ja: '入力欄には、値とそれを書き換える関数も渡します。値をどこに置くかは、つなぎが決めます。',
  en: 'A field also takes its value and a function that sets it. Where the value lives is up to the glue.',
});

export const renderLabel = message({
  ja: '入力欄は`label`を必須で持ち、`FormControl`で描きます。`label`は欄を指す`<label>`になり、ラジオボタンのようなグループではグループの名前になります。任意の`helpText`は欄の下に出て、欄の説明になります。`Checkbox`と`Switch`は`FormControl`を使わず、`label`と`helpText`を自分で描きます。',
  en: 'A field takes a required `label` and is drawn through `FormControl`. The label is a `<label>` that points at the field, or the name of a group such as radio buttons. An optional `helpText` appears under the field and describes it. `Checkbox` and `Switch` skip `FormControl` and draw their `label` and `helpText` themselves.',
});

export const renderEvents = message({
  ja: '`events`を持つコンポーネントには、モデルが結び付けた操作の関数を`on`で渡します。結び付いていない`Card`は、押せる形になりません。',
  en: 'A component with `events` also takes `on`, the function of each event the model bound. A `Card` with nothing bound is not pressable.',
});

export const renderToast = message({
  ja: '描いたUIは、アプリの`ToastProvider`の中に置きます。`Toast`は、そのプロバイダの領域にトーストを出します。プロバイダの外で描くと、`useToast must be used within a ToastProvider`のエラーになります。',
  en: 'Draw the generated UI inside the application’s `ToastProvider`. `Toast` opens its toast in that provider’s region. Drawn outside one, it fails with `useToast must be used within a ToastProvider`.',
});

export const glueTitle = message({
  ja: '形式とのつなぎ',
  en: 'Connecting a format',
});

export const glueDescription = message({
  ja: 'つなぎは`catalog`を回して、コンポーネントを名前ごとに形式へ登録します。コンポーネントの名前を1つも書かないので、ライブラリに部品が増えてもつなぎは変わりません。',
  en: 'The glue maps over `catalog` and registers each component with the format by name. It names no component, so a component added to the library needs no change to the glue.',
});

export const glueBinding = message({
  ja: '入力欄の値は、形式の状態に結び付けます。json-renderなら`$bindState`で、OpenUIなら`name`で、A2UIなら`@path`でデータモデルに結び付けます。',
  en: 'Each field’s value is bound to the format’s state: with `$bindState` in json-render, by `name` in OpenUI, and with `@path` into the data model in A2UI.',
});

export const glueEvents = message({
  ja: '利用者の操作は、形式の操作に結び付けます。A2UIなら`press`の`event`、json-renderなら`on.press`、OpenUIなら`press`の引数です。',
  en: 'Each event is bound to the format’s own action: an `event` in `press` in A2UI, `on.press` in json-render, and the `press` argument in OpenUI.',
});

export const glueAnyTypes = message({
  ja: 'つなぎは部品の名前を実行時にしか知らないので、部品ごとの型を使えません。`catalog`の項目は、型を消した`AnyCatalogEntry`として読めます。描画の関数は`rendererOf(name)`で引くと、型を消した`AnyRenderer`が返ります。どちらもキャストなしで書けます。',
  en: 'The glue knows a component’s name only at run time, so each component’s own types are of no use there. Read an entry of `catalog` as an `AnyCatalogEntry`, and look its renderer up with `rendererOf(name)`, which returns an `AnyRenderer`. Both have the types erased, so the glue needs no cast.',
});

export const glueExample = message({
  ja: 'A2UI、json-render、OpenUI、AI SDKのつなぎは、リポジトリの`examples/ui-integrations`にあります。どれも変更のたびにブラウザで確かめています。',
  en: 'Working glue for A2UI, json-render, OpenUI and the AI SDK lives in `examples/ui-integrations` in the repository. Each runs in a real browser on every change.',
});

export const glueCopy = message({
  ja: '使う形式のつなぎを、アプリに写して持ちます。',
  en: 'Copy the glue for the format you use into your app.',
});

export const glueLink = message({
  ja: 'GitHubでつなぎを見る',
  en: 'See the glue on GitHub',
});

export const validateTitle = message({
  ja: '出力の検証',
  en: 'Validating the output',
});

export const validateDescription = message({
  ja: '`catalogPropIssues`は、モデルが書いたコンポーネントを1つ確かめて、誤りを英語の文の配列で返します。空の配列なら、そのまま描けます。',
  en: '`catalogPropIssues` checks one component the model wrote and returns what is wrong with it as English sentences. An empty array means it renders as written.',
});

export const validateUnknown = message({
  ja: 'zodは知らないキーを、エラーにせず取り除きます。そのため、スキーマにないpropも誤りとして返します。`Table`の列のようにpropsの中に置くオブジェクトは、知らないキーを受け付けません。その誤りは`Table.columns.1`のように、オブジェクトの位置を付けて返します。',
  en: 'zod drops a key it does not know instead of failing, so a prop missing from the schema is reported as an issue too. An object inside the props, such as a `Table` column, refuses a key it does not know. That issue comes back with the object’s position, as `Table.columns.1`.',
});

export const validateAcross = message({
  ja: 'propどうしの関係も確かめ、ほかの誤りと一緒に返します。`Table`と`DataTable`にセルの数が列の数と違う行があれば、`Table.rows.1`のように行の位置を付けて返します。日付や時刻の`type`を持つ`TextField`では、`defaultValue`がその種類の書式に合うかを確かめます。`Select`や`Radio`のように選択肢を持つ入力欄では、`defaultValue`が`options`のどれかの`value`かを確かめます。',
  en: 'Props are checked against each other too, and those issues come back with the rest. A row of a `Table` or `DataTable` whose number of cells differs from the number of columns comes back with its position, as `Table.rows.1`. A `TextField` with a date or time `type` must have a `defaultValue` in that kind’s format. On a field with `options`, such as `Select` or `Radio`, the `defaultValue` must be the `value` of one of them.',
});

export const validateRepair = message({
  ja: '形式の構造の検証のあとに要素ごとに呼び、集めた誤りをモデルに送り返します。',
  en: 'Call it for every element after the format’s own structural check, and send the issues back to the model.',
});

export const promptTitle = message({
  ja: 'プロンプトの言語',
  en: 'The language of the prompt',
});

export const promptLanguage = message({
  ja: 'カタログがLLMに渡す文は、アプリのロケールに関係なくすべて英語です。UIに書かれる文の言語を決めたいときは、約束事を自分で足します。',
  en: 'Everything the catalog hands the model is English, whatever the application’s locale. To set the language of the text written into the UI, add a rule of your own.',
});

export const promptRules = message({
  ja: '`catalogRules`は、表の各行にセルを列の数だけ置くといった、LLMが破りやすい約束事の一覧です。形式のプロンプトに渡します。',
  en: '`catalogRules` lists the rules a model most often breaks, such as giving a table row as many cells as there are columns. Pass it to the format’s prompt.',
});

export const promptLanguageCallout = message({
  ja: 'UIの文の言語を決める約束事',
  en: 'A rule that sets the language of the UI text',
});
