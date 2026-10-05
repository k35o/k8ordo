import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'ルート表は、アプリが答えるすべてのパスを1か所に並べたものです。このページでは、パターンの書き方と照合の順序、ページのまとめ方、定義した時点でエラーになる書き方を説明します。',
  en: 'The route table lists every path the app answers, in one place. This page covers how patterns are written, the order they match in, how pages are grouped, and what fails as soon as the table is defined.',
});

export const shapeTitle = message({
  ja: 'ページとページのまとまり',
  en: 'Pages, and groups of pages',
});

export const shapeDescription = message({
  ja: 'ルート表の値は2種類です。1つはページのコンポーネントそのもので、もう1つは`children`を持つオブジェクトです。オブジェクトは下のページをまとめ、`layout`があればそのコンポーネントで包みます。',
  en: 'A value in the route table is one of two things: the page component itself, or an object with `children`. The object groups the pages below it, and wraps them in its `layout` when it has one.',
});

export const shapeKeys = message({
  ja: '`children`のキーは、親のパターンに続けて読みます。上の表では、`/:id`は`/products/:id`のページで、`/`は`/products`そのもののページです。',
  en: 'A key in `children` continues its parent’s pattern. In the table above, `/:id` is the page at `/products/:id`, and `/` is the page at `/products` itself.',
});

export const shapeNest = message({
  ja: '`/products/42`を開くと、`ProductsLayout`の`<Outlet />`の位置に`ProductPage`が描かれます。オブジェクトは入れ子にでき、レイアウトも外側から順に入れ子になります。',
  en: 'At `/products/42`, `ProductPage` renders where `ProductsLayout` puts its `<Outlet />`. Objects nest, and their layouts nest with them, outermost first.',
});

export const shapeTrailingSlash = message({
  ja: '末尾のスラッシュは無いものとして照合します。`/products/`を開いても、`/products`と同じページになります。',
  en: 'A trailing slash is ignored when matching, so `/products/` is the same page as `/products`.',
});

export const shapeMore = message({
  ja: 'オブジェクトには、エラーと読み込み中の表示も書けます。書き方は「エラーと読み込み中の表示を出す」で説明します。',
  en: 'The object can also say what to show on an error and while loading; see “Errors and loading states”.',
});

export const paramTitle = message({
  ja: 'パスの一部をparamで受け取る',
  en: 'Take part of the path as a param',
});

export const paramDescription = message({
  ja: '`:name`の形の区間は、パスのその位置にある文字列を受け取ります。受け取るのは空でない1区間だけで、`/`をまたぐことはありません。',
  en: 'A segment written `:name` takes the string at that place in the path: exactly one non-empty segment, never anything across a `/`.',
});

export const paramMatch = message({
  ja: '`match`は、`<Router>`が内部で行う照合をそのまま呼ぶ関数です。ブラウザが無くても動くので、パスがどのページになるかをこうして確かめられます。',
  en: '`match` is the very matching `<Router>` performs, as a plain function. It needs no browser, so it shows which page a path lands on.',
});

export const paramDecoded = message({
  ja: '受け取った値はデコードされるので、`%2F`は`/`に戻ります。paramの型はパターンの文字列から決まり、`/:locale/products/:id`なら`{ locale: string; id: string }`です。',
  en: 'The value is decoded, so `%2F` comes back as `/`. The params’ type comes from the pattern string: `/:locale/products/:id` gives `{ locale: string; id: string }`.',
});

export const wildcardTitle = message({
  ja: 'どのパターンにも合わないパスを受ける',
  en: 'Catch the paths nothing else matched',
});

export const wildcardDescription = message({
  ja: '`/*`は、それより前のどのパターンにも合わなかったパスを受けます。`:name`と違って区間の数を問わないので、存在しないページへのパスを1つのコンポーネントで受け止められます。',
  en: '`/*` takes whatever path no pattern above it matched. Unlike `:name`, it takes any number of segments, so one component can answer every page that does not exist.',
});

export const wildcardNotParam = message({
  ja: '`/*`が受けた部分は、paramsに入りません。また、`/*`は照合のためのパターンで、リンク先にはなりません。`href`に渡すと、実行時に`TypeError`を投げます。',
  en: 'What `/*` takes does not become a param. It is also a pattern to match, never one to link to: handed to `href`, it throws a `TypeError` at run time.',
});

export const wildcardBelow = message({
  ja: '`/products/*`のように途中に書くと、`/products`より下のパスだけを受けます。`/products`そのものには合いません。',
  en: 'Written after a prefix, as in `/products/*`, it takes only the paths below `/products`, never `/products` itself.',
});

export const wildcardDownload = message({
  ja: '表の最後に`/*`を置くと、ホストが配るファイルへのリンクもこのパターンに合います。`/report.pdf`のようなリンクには`download`属性を付けてください。詳しくは「リンクを張り、移動する」で説明します。',
  en: 'With `/*` at the end of the table, a link to a file the host serves matches it too. Give a link such as `/report.pdf` the `download` attribute; “Link and navigate” explains why.',
});

export const groupTitle = message({
  ja: 'パスを変えずにページをまとめる',
  en: 'Group pages without changing the path',
});

export const groupDescription = message({
  ja: '`/(name)`の形のキーはグループです。下のページをまとめてレイアウトで包みますが、パスには何も足しません。',
  en: 'A key written `/(name)` is a group. It gathers the pages below it and wraps them in a layout, but adds nothing to the path.',
});

export const groupResult = message({
  ja: '`/pricing`は`MarketingLayout`の中に、`/guide`は`DocsLayout`の中に描かれます。パスに`marketing`や`docs`は現れません。',
  en: '`/pricing` renders inside `MarketingLayout` and `/guide` inside `DocsLayout`, and neither `marketing` nor `docs` appears in the path.',
});

export const groupWhy = message({
  ja: 'グループが要るのは、同じ深さにある2つのまとまりに、別々のレイアウトを付けたいときです。1つのオブジェクトに`/`のキーは1度しか書けないので、`/`のオブジェクトを2つ並べることはできません。',
  en: 'A group is what lets two sets of pages at the same depth have different layouts. An object can hold the `/` key only once, so two `/` objects side by side are not possible.',
});

export const orderTitle = message({
  ja: '上から順に照合する',
  en: 'Patterns match from the top down',
});

export const orderDescription = message({
  ja: '照合はルート表を上から順にたどり、最初に合ったパターンを選びます。より具体的なパターンを優先する規則は無く、書いた順がそのまま優先順位です。',
  en: 'Matching walks the route table from the top and takes the first pattern that fits. No rule prefers the more specific pattern: the order you wrote is the order of precedence.',
});

export const orderShadowed = message({
  ja: 'このパターンには、どのパスも届かない',
  en: 'No path ever reaches this pattern',
});

export const orderWrong = message({
  ja: "この順では、`/products/new`も`/products/:id`に合います。そのため、`id`が`'new'`の`ProductPage`が描かれます。",
  en: "In this order, `/products/new` matches `/products/:id` as well, so `ProductPage` renders with `id` set to `'new'`.",
});

export const orderRight = message({
  ja: '決まった区間のパターンを先に書けば、`/products/new`は`NewProduct`に届き、それ以外の商品のパスは`ProductPage`に届きます。',
  en: 'Write the literal pattern first, and `/products/new` reaches `NewProduct` while every other product path reaches `ProductPage`.',
});

export const orderRead = message({
  ja: '順番だけで決まるので、ルート表はコードと同じように上から読めば、どのパスがどのページになるか分かります。`/*`を最後に置くのも同じ理由です。',
  en: 'Since order alone decides, you read the table top to bottom like any other code to know which page a path becomes. It is also why `/*` goes last.',
});

export const unmatchedTitle = message({
  ja: '表に無いパスはブラウザに任せる',
  en: 'Paths outside the table go to the browser',
});

export const unmatchedDescription = message({
  ja: '`/*`を置かない表では、どのパターンにも合わないパスがあります。`<Router>`はそうしたパスへのナビゲーションを引き受けず、ブラウザのふつうのページの読み込みに任せます。',
  en: 'A table without `/*` leaves some paths unmatched. `<Router>` does not take navigations to them, and leaves them to the browser as an ordinary page load.',
});

export const unmatchedServer = message({
  ja: 'そのため、サーバーが返す本物の404がそのまま表示されます。また、表に無いパスでページを開いたとき、`<Router>`は何も描きません。推測でほかのページを出すことはしません。',
  en: 'The server’s real 404 is then what shows. And when the app is opened at a path the table lacks, `<Router>` renders nothing rather than guessing at another page.',
});

export const refusedTitle = message({
  ja: '定義した時点でエラーになる書き方',
  en: 'What fails as soon as the table is defined',
});

export const refusedDescription = message({
  ja: 'ルート表は、`defineRoutes`を呼んだ時点で検査されます。誰かがそのページを最初に開いたときではないので、書き間違いはアプリを起動したときに分かります。エラーはどれも`TypeError`です。',
  en: 'The route table is checked when `defineRoutes` runs, not when someone first opens the page, so a mistake shows up as soon as the app starts. Every one of these is a `TypeError`.',
});

export const refusedNoSlash = message({
  ja: '`/`で始まらないキー',
  en: 'A key that does not start with `/`',
});

export const refusedParentheses = message({
  ja: 'グループの形になっていない括弧（`/(admin)/new`など）',
  en: 'Parentheses that are not exactly a group, such as `/(admin)/new`',
});

export const refusedGroupLeaf = message({
  ja: '`children`を持たないグループ',
  en: 'A group without `children`',
});

export const refusedTwice = message({
  ja: '同じパターンの2度目の宣言（入れ子の位置が違っても数えます）',
  en: 'The same pattern declared twice, wherever the copies nest',
});

export const refusedUnparsable = message({
  ja: 'URLPatternが解釈できないパターン：URLPattern自身の`TypeError`になります',
  en: 'A pattern URLPattern cannot parse: URLPattern’s own `TypeError`',
});

export const refusedWhy = message({
  ja: '括弧を拒むのは、URLPatternが`(…)`を正規表現として読むからです。`/(admin)/new`を通すと、名前の無いparamを受け取りながら`/admin/new`に黙って合ってしまいます。',
  en: 'Parentheses are refused because URLPattern reads `(…)` as a regular expression: `/(admin)/new` would quietly match `/admin/new` while capturing a nameless param.',
});

export const refusedGroupWhy = message({
  ja: 'グループに`children`を求めるのは、パスに何も足さないページが、親の`/`のページの2度目の宣言になってしまうからです。',
  en: 'A group needs `children` because a page that adds nothing to the path would declare its parent’s `/` page a second time.',
});
