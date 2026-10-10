import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '定義からリンクを作れるようになります。クエリは既定値を省いた形にそろい、パスはルート表で型検査できます。',
  en: 'Build links from a definition. The query leaves defaults out, and the path is checked against the route table.',
});

export const hrefTitle = message({
  ja: '`href`と`search`',
  en: '`href` and `search`',
});

export const hrefCanonical = message({
  ja: '`href(path, values?)`は、定義からリンクを作ります。指定しなかったフィールドは既定値として扱い、既定値のままのフィールドはクエリから省きます。できるURLの形は',
  en: '`href(path, values?)` builds a link from the definition. A field you leave out means its default, and a field at its default is left out of the query. The shape of the URL it builds is described on ',
});

export const see = message({
  ja: 'を見てください。',
  en: '.',
});

export const hrefSearch = message({
  ja: '`search(values?)`は、`?`を付けずにクエリ文字列だけを返します。パスを自分で組み立てるときに使います。たとえば、ダウンロードのURLに一覧と同じ条件を付けるときです。',
  en: '`search(values?)` returns the query string alone, without the `?`. Use it when you put the path together yourself, such as giving a download URL the same filters as the list.',
});

export const hrefEdges = message({
  ja: '返り値の型は、渡したパスをリテラルのまま残します。リンクを受け取る側の型検査（Next.jsの`<Link>`など）は、この型からクエリを除いてパスを確かめます。`entry`だけの定義では、`href`はクエリの無いリンクを返し、`search`は空の文字列を返します。URLで表せない値を渡すと、どちらも`has no URL serialization`を含むエラーになります。',
  en: 'The return type keeps the path you passed as a literal, so a typed-route check on the receiving side, such as Next.js’s `<Link>`, can strip the query and verify the path. For an `entry`-only definition, `href` returns the link with no query and `search` an empty string. A value no URL can represent makes both throw an error containing `has no URL serialization`.',
});

export const baseTitle = message({
  ja: 'Viteの`base`',
  en: 'Vite’s `base`',
});

export const baseRoot = message({
  ja: "`href`に渡すパスは、ルート表のパターンと同じく`base`を含めずに書きます。返るリンクには、Viteの`base`が前に付きます。`base`が`'/docs/'`なら、`'/docs/products?page=2'`になります。",
  en: "The path `href` takes is written without the `base`, as the patterns of the route table are. The link it returns has Vite’s `base` in front: under `base: '/docs/'`, it is `'/docs/products?page=2'`.",
});

export const baseRouterHref = message({
  ja: '`@k8ordo/router`の`href`が返したリンクには、すでに`base`が付いているので渡さないでください。',
  en: 'Do not pass it a link that `href` of `@k8ordo/router` returned, since that link already carries the `base`.',
});

export const baseOutside = message({
  ja: 'Viteの外、たとえばNext.jsでは`import.meta.env`が無いので何も付けません。`basePath`は、そのフレームワークの`<Link>`が付けます。',
  en: 'Outside Vite, in Next.js for example, there is no `import.meta.env`, so nothing is prepended. That framework’s own `<Link>` adds its `basePath`.',
});

export const typedTitle = message({
  ja: 'パスの型検査',
  en: 'Typed paths',
});

export const typedRegister = message({
  ja: '`Register`を一度拡張すると、アプリの中のすべての`href`が、ルート表に無いパスを型エラーにします。`routes: typeof routes`の1行は、`@k8ordo/router`の',
  en: 'Augment `Register` once, and every `href` in the application turns a path the route table lacks into a type error. The line `routes: typeof routes` is the same as in the `@k8ordo/router` augmentation, described in ',
});

export const typedRegisterAfter = message({
  ja: 'の拡張と同じです。`@k8ordo/framework`では、この宣言が`src/routes/`から`.k8ordo/register.gen.ts`に生成されるので、自分では書きません。生成されるのは、アプリ自身の`package.json`の`dependencies`か`devDependencies`に`@k8ordo/state`があるときです。ほかのパッケージを経由した依存は数えません。',
  en: '. Under `@k8ordo/framework` this declaration is generated from `src/routes/` into `.k8ordo/register.gen.ts`, so do not write it yourself. It is generated when the application’s own `package.json` lists `@k8ordo/state` in `dependencies` or `devDependencies`. A dependency through another package does not count.',
});

export const typedMatch = message({
  ja: `パスは、表のパターンとセグメントごとに照合します。固定のセグメントは、パターンと同じ綴りが要ります。\`:param\`のセグメントには、空でない1セグメントなら何でも入ります。テンプレートリテラルの\`\${string}\`も通ります。\`*\`を含むパターンには、リンクできません。どのパターンにも当たらないパスは型エラーです。\`/:locale\`で始まる表でも、\`'/ja/nowhere'\`は拒まれます。`,
  en: `The path is matched against the patterns of the table segment by segment. A fixed segment must be spelled as the pattern spells it. A \`:param\` segment takes any one non-empty segment, a \`\${string}\` from a template literal included. A pattern with a \`*\` cannot be linked to. A path no pattern matches is a type error, so even a table starting with \`/:locale\` refuses \`'/ja/nowhere'\`.`,
});

export const typedRuntime = message({
  ja: '検査は`@k8ordo/router`の`NavigablePath`を型として使うだけです。ルーターは任意のpeerのままで、実行時には読み込まれません。',
  en: 'The check uses `NavigablePath` from `@k8ordo/router` as a type only. The router stays an optional peer and never loads at runtime.',
});

export const typedPath = message({
  ja: '`@k8ordo/router`以外のルーターには渡せる表が無いので、そのルーターのパスのunionを`path`に登録します。Next.jsなら`next`の`Route`です。`routes`と`path`の両方があれば、`routes`が優先されます。どちらも無ければ、`/`で始まる文字列が何でも通ります。',
  en: 'A router other than `@k8ordo/router` has no table to hand over, so register the path union of that router under `path`, such as `Route` from `next`. When both `routes` and `path` are present, `routes` wins. With neither, any string starting with `/` passes.',
});

export const typedLibrary = message({
  ja: '`Register`の拡張はアプリの中でだけ行ってください。共有のライブラリで拡張すると、その制約が使う側のすべてに及びます。',
  en: 'Augment `Register` only in an application. A shared library that augments it imposes the constraint on every consumer.',
});
