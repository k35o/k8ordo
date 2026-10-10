import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`defineRoutes`でルート表を書き、どのパスがどのページになるかを決められるようになります。',
  en: 'Write the route table with `defineRoutes` and decide which page each path becomes.',
});

export const shapeTitle = message({
  ja: 'ページとレイアウト',
  en: 'Pages and layouts',
});

export const shapeValues = message({
  ja: 'ルート表の値は、ページのコンポーネントか、`children`を持つオブジェクトです。オブジェクトは下のページをまとめ、`layout`があればそのコンポーネントで包みます。',
  en: 'A value in the route table is either a page component or an object with `children`. The object groups the pages below it and wraps them in its `layout` when it has one.',
});

export const shapeKeys = message({
  ja: '`children`のキーは、親のパターンに続けて読みます。`/:id`は`/products/:id`のページで、`/`は`/products`のページです。`/products/42`を開くと、`ProductsLayout`の`<Outlet />`の位置に`ProductPage`が表示されます。',
  en: 'A key in `children` continues the parent’s pattern: `/:id` is the page at `/products/:id`, and `/` is the page at `/products`. At `/products/42`, `ProductPage` renders where `ProductsLayout` places its `<Outlet />`.',
});

export const shapeTrailingSlash = message({
  ja: 'オブジェクトは入れ子にでき、レイアウトも外側から順に入れ子になります。末尾のスラッシュは無いものとして照合するので、`/products/`は`/products`と同じページです。',
  en: 'Objects nest, and their layouts nest with them from the outside in. A trailing slash is ignored when matching, so `/products/` is the same page as `/products`.',
});

export const shapeMoreBefore = message({
  ja: 'オブジェクトには`error`と`loading`も書けます。書き方は',
  en: 'The object can also hold `error` and `loading`. See ',
});

export const shapeMoreAfter = message({
  ja: 'を見てください。',
  en: ' for how to write them.',
});

export const paramTitle = message({
  ja: 'パスのparam',
  en: 'Path params',
});

export const paramSegment = message({
  ja: '`:name`の区間は、パスのその位置にある文字列を受け取ります。受け取るのは空でない1区間だけで、`/`をまたぎません。値はデコードされるので、`%2F`は`/`に戻ります。',
  en: 'A `:name` segment takes the string at that position in the path: exactly one non-empty segment, never across a `/`. The value is decoded, so `%2F` comes back as `/`.',
});

export const paramType = message({
  ja: 'paramの型はパターンの文字列から決まります。`/:locale/products/:id`なら`{ locale: string; id: string }`です。',
  en: 'The type of the params comes from the pattern string. `/:locale/products/:id` gives `{ locale: string; id: string }`.',
});

export const paramMatch = message({
  ja: '`match`は、`<Router>`が内部で行う照合をそのまま呼ぶ関数です。ブラウザが無くても動くので、パスがどのページになるかをこうして確かめられます。',
  en: '`match` is the same matching `<Router>` performs, as a plain function. It needs no browser, so it is a quick way to check which page a path becomes.',
});

export const wildcardTitle = message({
  ja: '`/*`',
  en: '`/*`',
});

export const wildcardRest = message({
  ja: '`/*`は、それより前のどのパターンにも合わなかったパスに合います。`:name`と違って区間の数を問いません。`/*`に合った部分は`params`に入りません。',
  en: '`/*` takes every path no pattern above it matched. Unlike `:name`, it takes any number of segments. What it takes does not become a param.',
});

export const wildcardBelow = message({
  ja: '`/products/*`のように前に区間を付けて書くと、`/products`より下のパスだけに合います。`/products`そのものには合いません。',
  en: 'Written after a prefix, as in `/products/*`, it matches only the paths below `/products`, not `/products` itself.',
});

export const wildcardNotLink = message({
  ja: '`/*`は照合のためのパターンで、リンク先にはなりません。`href`に渡すと、実行時に`TypeError`になります（`"/*" is a wildcard — it has no href`）。',
  en: '`/*` is a pattern to match, not one to link to. Passed to `href`, it throws a `TypeError` at runtime (`"/*" is a wildcard — it has no href`).',
});

export const wildcardDownloadBefore = message({
  ja: '表の最後に`/*`を置くときは、ファイルへのリンクに`download`属性を付けます。詳しくは',
  en: 'With `/*` at the end of the table, give a link to a file the `download` attribute. See ',
});

export const wildcardDownloadAfter = message({
  ja: 'を見てください。',
  en: ' for the details.',
});

export const groupTitle = message({
  ja: 'グループ',
  en: 'Groups',
});

export const groupResult = message({
  ja: '`/(name)`のキーはグループです。下のページをレイアウトで包みますが、パスには何も足しません。`/pricing`は`MarketingLayout`の中に、`/guide`は`DocsLayout`の中に表示されます。',
  en: 'A `/(name)` key is a group. It wraps the pages below it in a layout but adds nothing to the path: `/pricing` renders inside `MarketingLayout` and `/guide` inside `DocsLayout`.',
});

export const groupWhy = message({
  ja: 'グループは、同じ深さにある2つのまとまりに別々のレイアウトを付けるときに使います。1つのオブジェクトに`/`のキーは1度しか書けないので、`/`のオブジェクトを2つ並べられません。',
  en: 'Use a group when two sets of pages at the same depth need different layouts. An object can hold the `/` key only once, so two `/` objects cannot sit side by side.',
});

export const orderTitle = message({
  ja: '照合の順序',
  en: 'Match order',
});

export const orderShadowed = message({
  ja: 'このパターンが選ばれることはない',
  en: 'This pattern is never chosen',
});

export const orderWrong = message({
  ja: "照合は表を上から順にたどり、最初に合ったパターンを選びます。具体的なパターンを優先する規則は無く、書いた順がそのまま優先順位です。この順では`/products/new`も`/products/:id`に合い、`id`が`'new'`の`ProductPage`が表示されます。",
  en: "Matching walks the table from the top and takes the first pattern that fits. No rule prefers the more specific pattern: the order you wrote is the precedence. In this order, `/products/new` matches `/products/:id` too, so `ProductPage` renders with `id` set to `'new'`.",
});

export const orderRight = message({
  ja: '決まった区間のパターンを先に書けば、`/products/new`は`NewProduct`になります。`/*`を最後に置くのも同じ理由です。',
  en: 'Write the literal pattern first, and `/products/new` becomes `NewProduct`. `/*` goes last for the same reason.',
});

export const unmatchedTitle = message({
  ja: '表に無いパス',
  en: 'Paths outside the table',
});

export const unmatchedBrowser = message({
  ja: '`/*`を置かない表では、どのパターンにも合わないパスがあります。`<Router>`はそのパスへの移動を処理しません。ブラウザが通常どおりページを読み込み、サーバーが返す404が表示されます。',
  en: 'A table without `/*` leaves some paths unmatched. `<Router>` does not handle navigation to such a path, so the browser loads the page normally and shows the server’s 404.',
});

export const unmatchedRender = message({
  ja: '表に無いパスでアプリを開いたとき、`<Router>`は何も表示しません。',
  en: 'When the app opens at a path outside the table, `<Router>` renders nothing.',
});

export const refusedTitle = message({
  ja: '拒まれる書き方',
  en: 'Rejected patterns',
});

export const refusedWhen = message({
  ja: 'ルート表は、`defineRoutes`を呼んだ時点で検査されます。書き間違いはアプリを起動したときに分かります。エラーはどれも`TypeError`です。',
  en: 'The route table is checked when `defineRoutes` runs, so a mistake shows up as soon as the app starts. Every error is a `TypeError`.',
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
  ja: '`URLPattern`が解釈できないパターン：`URLPattern`自身の`TypeError`になります',
  en: 'A pattern `URLPattern` cannot parse: `URLPattern`’s own `TypeError`',
});

export const refusedWhy = message({
  ja: '括弧を拒むのは、`URLPattern`が`(…)`を正規表現として読むからです。`children`の無いグループは、親の`/`のページの2度目の宣言になります。',
  en: 'Parentheses are refused because `URLPattern` reads `(…)` as a regular expression. A group without `children` would declare its parent’s `/` page a second time.',
});
