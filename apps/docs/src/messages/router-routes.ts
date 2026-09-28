import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'ルート表は、アプリが答える pathname を 1 か所に並べたものです。このページでは表の文法、照合の順序、定義した時点で拒まれる書き方、表に書くエラー境界、そして表から導かれる型を扱います。',
  en: 'The route table lists every pathname the application answers, in one place. This page covers the table’s grammar, the order it matches in, what is refused as soon as the table is defined, the error boundaries you write into it, and the types that come out of it.',
});

export const shapeTitle = message({
  ja: 'leaf と branch',
  en: 'Leaves and branches',
});

export const shapeDescription = message({
  ja: '表の値は 2 種類です。leaf は描画するコンポーネントそのもので、branch は `{ layout?, error?, children }` です。branch の `children` は同じ形の表で、キーは親のパターンに続けて読みます。',
  en: 'A value in the table is one of two things. A leaf is the component to render; a branch is `{ layout?, error?, children }`, where `children` is a table of the same shape whose keys continue the parent’s pattern.',
});

export const shapeIndex = message({
  ja: '子のキー `/` は branch 自身の index ページです。ルートに置いた `/` の branch は URL に何も足さないので、全ページを包むレイアウトになります。',
  en: 'A child key of `/` is the branch’s own index page. A branch at the root key `/` adds nothing to the URL, which makes its layout the one around every page.',
});

export const shapeStack = message({
  ja: '照合の結果は、外側のレイアウトから順に並べ、最後に leaf を置いたスタックです。レイアウトは次の要素を `<Outlet />` で描きます。`/products/42` なら `RootLayout` → `ProductsLayout` → `ProductPage` の順に入れ子になります。',
  en: 'A match is a stack: the layouts outer-first, then the leaf. Each layout renders the next element through `<Outlet />`, so `/products/42` nests as `RootLayout` → `ProductsLayout` → `ProductPage`.',
});

export const shapeProps = message({
  ja: '`<Router>` は leaf にもレイアウトにも props を渡しません。params は `useParams` で読みます。表が受け付けるコンポーネントの型 `RouteComponent` は `ComponentType<never>` なので、フレームワークが props を渡すコンポーネントも同じ表に入ります。',
  en: '`<Router>` passes no props to leaves or layouts; params are read with `useParams`. The component type the table accepts, `RouteComponent`, is `ComponentType<never>`, so a component the framework does pass props to fits the same table.',
});

export const shapeLazy = message({
  ja: '`React.lazy` の戻り値も leaf として置けます。branch は `children` キーの有無で見分けるので、関数ではない lazy コンポーネントを branch と取り違えません。chunk が届くまでの間に fallback を出す場所として、上のレイアウトに `<Suspense>` を置きます。fallback が出るのは、最初の描画と、その `<Suspense>` を新しくマウントするナビゲーションのときです。すでに画面にある `<Suspense>` の下でページが切り替わるときは、背景での描画が前のページを残します。',
  en: 'A `React.lazy` component works as a leaf. A branch is recognised by its `children` key, so a lazy component — an object, not a function — is never mistaken for one. Put a `<Suspense>` in a layout above it so there is somewhere to fall back to while the chunk arrives. The fallback shows on the first render and on a navigation that newly mounts that `<Suspense>`; when the page changes under a `<Suspense>` already on screen, the background render keeps the previous page instead.',
});

export const grammarTitle = message({
  ja: 'パターンの文法',
  en: 'Pattern grammar',
});

export const grammarDescription = message({
  ja: 'パターンは URLPattern の pathname として照合します。表で使う記法は、固定の区間、`:name`、末尾の `/*`、そして URL に現れないグループ `/(name)` です。',
  en: 'Patterns are matched as URLPattern pathnames. The table uses literal segments, `:name`, a trailing `/*`, and the group `/(name)`, which never appears in the URL.',
});

export const grammarTable = {
  pattern: message({ ja: 'パターン', en: 'Pattern' }),
  pathname: message({ ja: 'pathname', en: 'Pathname' }),
  params: message({ ja: 'params', en: 'Params' }),
  note: message({ ja: '備考', en: 'Note' }),
  trailingSlash: message({
    ja: '末尾のスラッシュは同じ pathname',
    en: 'A trailing slash is the same pathname',
  }),
  param: message({
    ja: '`:name` は 1 区間を捕まえる',
    en: '`:name` captures one segment',
  }),
  decoded: message({
    ja: '値はデコードされる',
    en: 'The value is decoded',
  }),
  oneSegment: message({
    ja: '`/` をまたがない',
    en: 'It never spans a `/`',
  }),
  empty: message({
    ja: '空の区間には合わない',
    en: 'An empty segment does not match',
  }),
  wildcard: message({
    ja: 'ワイルドカードの中身は params に入らない',
    en: 'What the wildcard captured is not a param',
  }),
  wildcardIndex: message({
    ja: '`/*` より前の部分そのものには合わない',
    en: 'It does not match the part before `/*` on its own',
  }),
  group: message({
    ja: 'グループは URL に区間を足さない',
    en: 'A group adds no URL segment',
  }),
  noMatch: message({ ja: '一致しない', en: 'No match' }),
};

export const paramTitle = message({
  ja: '`:param`',
  en: '`:param`',
});

export const paramDescription = message({
  ja: '`:name` は空でない 1 区間を捕まえ、`decodeURIComponent` でデコードした文字列を返します。デコードできない綴りは書かれたまま残します。型はパターン文字列から推論され、`/:locale/products/:id` の params は `{ locale: string; id: string }` です。',
  en: '`:name` captures one non-empty segment and hands it back decoded with `decodeURIComponent`; a spelling that cannot be decoded is kept as written. The type is inferred from the pattern string: the params of `/:locale/products/:id` are `{ locale: string; id: string }`.',
});

export const wildcardTitle = message({
  ja: 'ワイルドカード `/*`',
  en: 'Wildcards: `/*`',
});

export const wildcardDescription = message({
  ja: '`/*` はそれより前の何にも合わなかった pathname を受けます。1 区間ではなく、下に続く任意の区間に合います。照合には使えますがリンク先にはならないので、`href` と `navigateTo` は実行時に `TypeError` で拒みます。`Register` を宣言していれば、型の段階でも拒みます。',
  en: '`/*` takes what nothing before it matched — not one segment but anything below. It is something to match, never something to link to, so `href` and `navigateTo` refuse it at run time with a `TypeError`, and in the types as well once `Register` is declared.',
});

export const wildcardRoot = message({
  ja: 'ルートの `/*` は `/` 自身にも合います。表の最後に置くのはこのためでもあります。',
  en: 'At the root, `/*` matches `/` itself as well — one more reason it goes last.',
});

export const groupTitle = message({
  ja: 'グループ `/(name)`',
  en: 'Groups: `/(name)`',
});

export const groupDescription = message({
  ja: 'グループは表を構造化します。自分のレイアウトと部分木を持ちますが、URL に区間を足しません。1 つのオブジェクトに `/` は 1 度しか書けないので、同じ深さの 2 つの区画に別々のレイアウトを持たせるにはグループが要ります。',
  en: 'A group structures the table — its own layout, its own subtree — without adding a URL segment. `/` can appear only once in an object, so two sections at the same depth could not otherwise have different layouts.',
});

export const groupNested = message({
  ja: '上の表で `/pricing` は `MarketingLayout` の中、`/guide` は `DocsLayout` の中に描かれ、URL には `marketing` も `docs` も現れません。グループは branch の中にも置けます。',
  en: 'In this table `/pricing` renders inside `MarketingLayout` and `/guide` inside `DocsLayout`, and neither `marketing` nor `docs` appears in the URL. A group can sit inside a branch as well.',
});

export const orderTitle = message({
  ja: '書いた順が規則',
  en: 'Order is the rule',
});

export const orderDescription = message({
  ja: '照合は表を上から順にたどり、最初に合ったパターンを採ります。優先順位は書いた順そのもので、特異度のランキングはありません。表はコードと同じように上から読めば答えが分かります。',
  en: 'Matching walks the table top to bottom and takes the first pattern that fits. Precedence is what you wrote; there is no specificity ranking to reason backwards from, so the table reads like the code it is.',
});

export const orderWrong = message({
  ja: 'この順では `/products/new` が `ProductPage` に合い、`id` が `new` になります。',
  en: 'In this order `/products/new` matches `ProductPage`, with `id` set to `new`.',
});

export const orderRight = message({
  ja: '固定の区間を先に書けば、`/products/new` は `NewProduct` に、それ以外の `/products/…` は `ProductPage` に届きます。',
  en: 'With the literal segment first, `/products/new` reaches `NewProduct` and every other `/products/…` reaches `ProductPage`.',
});

export const matchTitle = message({
  ja: '表を直接引く',
  en: 'Reading the table directly',
});

export const matchDescription = message({
  ja: '`defineRoutes` が返す `Routes` の操作は `match(pathname, accept?)` の 1 つです。勝ったパターン・params・スタックを `Match` として返し、何にも合わなければ `null` を返します。ブラウザを必要としないので、テストで表の形と優先順位を直接確かめられます。',
  en: 'The `Routes` object `defineRoutes` returns has one operation, `match(pathname, accept?)`. It returns a `Match` — the winning pattern, its params and its stack — or `null` when nothing fits. It needs no browser, so a test can assert a table’s shape and precedence directly.',
});

export const matchAccept = message({
  ja: '`accept` は合ったものを呼び出し側が断るための関数で、`false` を返すと照合はそのパターンが合わなかったものとして次へ進みます。フレームワークはこれで、スキーマが拒んだ params を「そのパターンが答えない pathname」として扱っています。',
  en: '`accept` lets the caller decline a fit: when it returns `false`, the walk goes on as if that pattern had not matched. The framework uses it so that a param a schema refuses is a pathname the pattern does not answer.',
});

export const refusedTitle = message({
  ja: '定義した時点で拒まれるもの',
  en: 'What fails at definition time',
});

export const refusedDescription = message({
  ja: '表はモジュールが読み込まれたときに検査されます。誰かが最初にそのページへ移動したときではありません。どのエラーも `TypeError` です。',
  en: 'A table is checked when its module loads, not when someone first navigates to the page. Every one of these is a `TypeError`.',
});

export const refusedTable = {
  written: message({ ja: '書いたもの', en: 'Written' }),
  error: message({ ja: 'エラー', en: 'Error' }),
  noSlash: message({
    ja: '`/` で始まらないキー',
    en: 'A key that does not start with `/`',
  }),
  parentheses: message({
    ja: 'グループそのものではない括弧',
    en: 'Parentheses that are not exactly a group',
  }),
  groupLeaf: message({
    ja: '`children` を持たないグループ',
    en: 'A group without `children`',
  }),
  twice: message({
    ja: '同じ完全パターンの 2 度目（入れ子の位置が違っても）',
    en: 'The same full pattern twice, wherever the copies nest',
  }),
  unparsable: message({
    ja: 'URLPattern が解釈できないパターン',
    en: 'A pattern URLPattern cannot parse',
  }),
  unparsableError: message({
    ja: 'URLPattern 自身の `TypeError`',
    en: 'URLPattern’s own `TypeError`',
  }),
};

export const refusedWhy = message({
  ja: '括弧を拒むのは、URLPattern が `(…)` を正規表現のグループとして読むからです。`/(admin)/new` を通すと、名前の無い param を捕まえながら `/admin/new` に黙って合ってしまいます。文法での括弧の意味はグループの 1 つだけです。グループに `children` を求めるのは、区間を足さない leaf が親の index の 2 度目の宣言になってしまうからです。',
  en: 'Parentheses are refused because URLPattern reads `(…)` as a regular-expression group: `/(admin)/new` would quietly match `/admin/new` and capture a nameless param. In the grammar, parentheses mean a group and nothing else. A group must have `children` because a leaf that adds no segment would be a second declaration of the parent’s index.',
});

export const errorTitle = message({
  ja: 'エラー境界',
  en: 'Error boundaries',
});

export const errorDescription = message({
  ja: 'branch には `layout` と並べて `error` を書けます。その下のどこかが描画中に throw すると、レイアウトの穴に `error` のコンポーネントが代わりに描かれ、レイアウトという枠はそのまま残ります。',
  en: 'A branch can name an `error` beside its `layout`. When anything below throws while rendering, the `error` component renders in the layout’s hole instead, and the frame the layout draws survives.',
});

export const errorProps = message({
  ja: '`error` のコンポーネントは `ErrorProps`（`{ error, reset }`）を受け取ります。型は `ErrorComponent` です。`error` は throw された値そのもので `unknown` 型です。`reset()` はその場で部分木をもう一度描画し、再び throw すればまた `error` が出ます。',
  en: 'The component receives `ErrorProps` — `{ error, reset }` — and its type is `ErrorComponent`. `error` is whatever was thrown, typed `unknown`. `reset()` renders the subtree again in place; if it throws again, the error component comes back.',
});

export const errorLeave = message({
  ja: '失敗したページを離れると、失敗は消えます。境界は `NavigationGeneration`（新しい木が画面に適用されるたびに変わる番号）が変わったときに失敗を手放します。pathname で判断しないのは、URL が木より先に確定するからです。境界の内側は作り直さないので、ページが替わってもその下のレイアウトの状態は残ります。search だけが変わる状態の更新では木が変わらないので、失敗もそのまま残ります。',
  en: 'Leaving the page that failed leaves the failure behind. The boundary lets it go when `NavigationGeneration` — a number that changes each time a new tree is applied — moves. It does not go by the pathname because the URL commits before the tree does. Nothing inside the boundary is recreated, so the layouts below it keep their state across a page change. A state change that only moves the search changes no tree, so the failure stays.',
});

export const errorScope = message({
  ja: '境界はレイアウトの内側にあるので、レイアウト自身の throw は同じ branch の `error` では受け止められず、さらに外側の branch の `error` に届きます。どこにも境界が無ければ、エラーは `<Router>` の外へ出ます。',
  en: 'The boundary sits inside the layout, so a throw from the layout itself is not caught by its own branch’s `error`; it reaches the `error` of a branch further out. With no boundary anywhere, the error leaves `<Router>`.',
});

export const errorSuspense = message({
  ja: '境界は下の部分木を `fallback` が `null` の `<Suspense>` でも包みます（サーバーでの描画で throw した部分木をブラウザに任せるため）。そのため `error` を持つ branch の下にある `React.lazy` のページは、最初の描画やその branch に入るナビゲーションで chunk を待つ間、上のレイアウトの `<Suspense>` ではなくこの境界の中で何も描きません。fallback を見せたいなら、`<Suspense>` をその branch より下のレイアウトに置くか、lazy コンポーネントを直接包みます。',
  en: 'The boundary also wraps what is below in a `<Suspense>` whose `fallback` is `null`, so that a subtree which throws during a server render is left for the browser. A `React.lazy` page under a branch that names `error` therefore renders nothing inside that boundary while its chunk loads on the first render or on a navigation that enters that branch, instead of reaching a `<Suspense>` in a layout above. To show a fallback, put the `<Suspense>` in a layout below that branch, or wrap the lazy component in one directly.',
});

export const errorFramework = message({
  ja: '`@k8ordo/static` と `@k8ordo/server` では、`error.tsx` が生成された表のこの `error` になります。',
  en: 'Under `@k8ordo/static` and `@k8ordo/server`, `error.tsx` becomes this same `error` in the generated table.',
});

export const typesTitle = message({
  ja: '表から導かれる型',
  en: 'Types derived from the table',
});

export const typesDescription = message({
  ja: '表の型はパターン文字列からの推論だけで決まり、コード生成を使いません。`routes` を Get Started で作った表（`/`・`/products`・`/products/:id`・`/*`）とすると、3 つの型は 2 つ目のコードのとおりに解決されます。',
  en: 'The table’s types come from inferring the pattern strings alone, with no code generation. With `routes` as the table built in Get Started (`/`, `/products`, `/products/:id`, `/*`), the three types resolve to what the second block shows.',
});

export const typesTable = {
  type: message({ ja: '型', en: 'Type' }),
  meaning: message({ ja: '意味', en: 'Meaning' }),
  patternOf: message({
    ja: '表のすべての leaf パターン（書いたとおりの綴り）',
    en: 'Every leaf pattern in the table, as written',
  }),
  navigablePatternOf: message({
    ja: 'リンク先にできるパターン。ワイルドカードを除いたもの',
    en: 'The patterns a link can point at: the wildcards excluded',
  }),
  navigablePath: message({
    ja: '`Path` を表のリンク可能なパターンと区間ごとに照合した結果。合えば `Path`、合わなければ `never`',
    en: '`Path` checked against the table’s linkable patterns, segment by segment: `Path` when one matches, `never` when none does',
  }),
  routes: message({
    ja: '`defineRoutes` の戻り値。`kind`・`record`（渡した表）・`match` を持つ',
    en: 'What `defineRoutes` returns: `kind`, `record` (the table as passed) and `match`',
  }),
  routesRecord: message({
    ja: '表そのものの型。キーは `/` で始まる文字列',
    en: 'The type of a table: keys are strings starting with `/`',
  }),
  routeNode: message({
    ja: '表の値。`RouteComponent` か branch',
    en: 'A value in the table: a `RouteComponent` or a branch',
  }),
  routeComponent: message({
    ja: 'leaf とレイアウトの型。`ComponentType<never>`',
    en: 'The type of a leaf or layout: `ComponentType<never>`',
  }),
  match: message({
    ja: '`match` の戻り値。`pattern`・`params`・`stack`（外側から順、leaf が最後）',
    en: 'What `match` returns: `pattern`, `params` and `stack` (outer-first, the leaf last)',
  }),
};

export const typesNavigablePath = message({
  ja: '`NavigablePath` は、`@k8ordo/state` の `href` がパスの検査に使う型です。',
  en: '`NavigablePath` is what `@k8ordo/state`’s `href` checks its paths with.',
});
