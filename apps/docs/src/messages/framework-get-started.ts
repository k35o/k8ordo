import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`@k8ordo/framework`で最初のページを作り、`vite build`で静的なファイルに書き出すまでを進めます。',
  en: 'Build a first page with `@k8ordo/framework` and write it out as static files with `vite build`.',
});

export const installTitle = message({
  ja: 'インストール',
  en: 'Install',
});

export const installRouter = message({
  ja: '`@k8ordo/router`は必須のpeerです。フレームワークとアプリが同じルーターを使うために入れます。',
  en: '`@k8ordo/router` is a required peer, installed so the framework and the application share one copy of the router.',
});

export const installDev = message({
  ja: '`@k8ordo/framework`と`@k8ordo/router`は、どちらのモードでも`devDependencies`に入れます。実行時に使うものはビルドがすべてバンドルするので、本番では読み込まれません。',
  en: '`@k8ordo/framework` and `@k8ordo/router` go in `devDependencies` in either mode. The build bundles everything the application runs, so nothing loads them in production.',
});

export const configTitle = message({
  ja: 'Viteの設定',
  en: 'Vite config',
});

export const configModeCallout = message({
  ja: "'static'：すべてのページをファイルに書き出す",
  en: "'static': every page written into files",
});

export const configPlugins = message({
  ja: '`framework()`が返すプラグインには、ReactのプラグインとRSCのパイプラインが入っています。`@vitejs/plugin-react`を自分で足す必要はありません。',
  en: 'The plugins `framework()` returns include React’s plugin and the RSC pipeline. You don’t need to add `@vitejs/plugin-react` yourself.',
});

export const configMode = message({
  ja: "`mode`は省略できません。ここでは`'static'`モードから始めます。リクエストごとに描画する`'server'`モードとの違いと選び方は",
  en: "`mode` is required. This guide starts with `'static'`. How it differs from `'server'`, which renders per request, and how to choose is covered in ",
});

export const configModuleType = message({
  ja: '`package.json`に`"type": "module"`が無いアプリでは、設定ファイルを`vite.config.mts`という名前にします。Viteは設定ファイルを`package.json`の`type`に従って読むので、`vite.config.ts`のままだとビルドと`vite dev`のたびに警告が出て、トップレベルの`await`を使う設定は読み込めません。ビルドの出力は`type`が無くても動きます。',
  en: 'In an application whose `package.json` has no `"type": "module"`, name the config `vite.config.mts`. Vite loads the config by the `type` in `package.json`, so as `vite.config.ts` it warns on every build and every `vite dev`, and a config using top-level `await` does not load. The build output runs either way.',
});

export const see = message({
  ja: 'を見てください。',
  en: '.',
});

export const tsconfigTitle = message({
  ja: '生成される型',
  en: 'Generated types',
});

export const tsconfigTypes = message({
  ja: 'フレームワークは、`src/routes/`から作ったルート表と型を`.k8ordo/`に書き出します。`include`にこのディレクトリを足すと、`href()`に渡すパスとページの`params`に型が付きます。生成するファイルは拡張子を書かずにimportするので、`moduleResolution`はViteと同じ`bundler`にします。',
  en: 'The framework writes a route table and its types, derived from `src/routes/`, into `.k8ordo/`. Add that directory to `include`, and the paths `href()` takes and a page’s `params` become typed. The generated files import without file extensions, so set `moduleResolution` to `bundler`, as Vite resolves.',
});

export const tsconfigCompiler = message({
  ja: '新しいアプリなら、この`tsconfig.json`をそのまま使えます。既存の`tsconfig.json`には、足りない設定だけを足します。`jsx`が無いと、ルート表がimportする`.tsx`のファイルを`tsc`が読めません。`vite/client`は`import.meta.env`に型を付けます。',
  en: 'This `tsconfig.json` is complete for a new application; to an existing one, add only what it lacks. Without `jsx`, `tsc` cannot read the `.tsx` files the route table imports. `vite/client` types `import.meta.env`.',
});

export const tsconfigConfig = message({
  ja: '`*.ts`と`*.mts`は、`vite.config.ts`や`vite.config.mts`を型検査に入れます。`mode`の書き忘れや、そのモードに無いオプションがエディタで型エラーになります。',
  en: '`*.ts` and `*.mts` bring `vite.config.ts` or `vite.config.mts` into type checking, so a missing `mode`, or an option the mode does not take, is a type error in the editor.',
});

export const tsconfigGit = message({
  ja: '`.k8ordo/`は`vite dev`と`vite build`が書き出し、自前の`.gitignore`を持ちます。アプリの`.gitignore`に足す必要はありません。cloneした直後にはまだ無いので、CIでは`tsc`の前に`vite build`を実行します。',
  en: '`vite dev` and `vite build` write `.k8ordo/`, and it has its own `.gitignore`. You don’t need to add it to your application’s. A fresh clone does not have it yet, so in CI run `vite build` before `tsc`.',
});

export const tsconfigPitfall = message({
  ja: '`.k8ordo`はドットで始まるので、`".k8ordo"`とディレクトリ名だけを書くと、中のファイルが型検査の対象に入りません。ビルドは通りますが、`href()`のパスは検査されなくなります。`request`や`search`のpropは`PageProps`から消え、`tsc`がエラーになります。`.k8ordo/**/*.ts`のように、グロブで書いてください。',
  en: '`.k8ordo` starts with a dot, so an entry naming only the directory, `".k8ordo"`, leaves the files inside out of type checking. The build still passes, but `href()` stops checking its paths, and `request` and `search` drop out of `PageProps`, so `tsc` fails. Write it as a glob: `.k8ordo/**/*.ts`.',
});

export const layoutTitle = message({
  ja: 'ルートレイアウト',
  en: 'Root layout',
});

export const layoutDocument = message({
  ja: '`src/routes/layout.tsx`は、すべてのページを包むレイアウトです。フレームワークはHTMLのテンプレートを持たないので、`<html>`と`<body>`、`<html>`の`lang`属性もこのファイルで書きます。',
  en: '`src/routes/layout.tsx` is the layout around every page. The framework has no HTML template, so this file renders `<html>` and `<body>` too, and sets the `lang` of `<html>`.',
});

export const layoutProps = message({
  ja: '`LayoutProps`などの型と`href()`などの関数は、`@k8ordo/router`でなく`@k8ordo/framework`からimportします。',
  en: 'Types such as `LayoutProps` and functions such as `href()` come from `@k8ordo/framework`, never from `@k8ordo/router`.',
});

export const layoutHydration = message({
  ja: 'ルートレイアウトが描画した文書は、まるごとハイドレーションの対象です。HTMLを書き換えるCDNの機能を有効にしていると、ハイドレーションに失敗することがあります。原因と直し方は',
  en: 'The whole document the root layout renders is hydrated. A CDN feature that rewrites HTML can make hydration fail. The cause and the fix are in ',
});

export const pageTitle = message({
  ja: '最初のページ',
  en: 'First page',
});

export const pageUrl = message({
  ja: "`page.tsx`を置いたディレクトリが、ページのURLになります。`src/routes/page.tsx`は`/`のページです。ディレクティブを書いていないファイルはServer Componentです。`'static'`モードではビルドのときに描画されます。",
  en: "A directory that holds a `page.tsx` is a URL, so `src/routes/page.tsx` is the page at `/`. A file with no directive is a Server Component; under `'static'` it renders at build time.",
});

export const pageTitleTag = message({
  ja: 'タイトルは、ページの中で`<title>`を描画して付けます。',
  en: 'A page sets its title by rendering a `<title>`.',
});

export const pageMore = message({
  ja: 'ページ間のリンクには専用のコンポーネントが無く、素の`<a>`に`href()`の値を渡します。ページの足し方とファイル名の決まりは',
  en: 'There is no link component: a link between pages is a plain `<a>` whose `href` comes from `href()`. Adding pages and the file naming rules are covered in ',
});

export const runTitle = message({
  ja: '開発サーバーとビルド',
  en: 'Dev server and build',
});

export const runDev = message({
  ja: '`vite dev`は、リクエストのたびにページを描画する開発サーバーです。Fast Refreshが効き、ファイルを保存すると表示がすぐに変わります。',
  en: '`vite dev` is a development server that renders a page per request, with Fast Refresh: save a file, and the change shows right away.',
});

export const runBuild = message({
  ja: '`vite build`はすべてのページを描画して`dist/client/`に書き出し、最後に書き出したルートの数を表示します。`dist/client/`はどの静的ホスティングにも置けます。',
  en: '`vite build` renders every page into `dist/client/`, and ends by printing how many routes it wrote. `dist/client/` can go on any static host.',
});

export const runMore = message({
  ja: "ホスティングへの置き方と、`'server'`モードでの動かし方は",
  en: "Putting it on a host, and running it under `'server'`, are covered in ",
});
