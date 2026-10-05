import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`framework()`のオプションと、`src/routes/`に置けるファイルの一覧です。それぞれの使い方は、ガイドの各ページで説明しています。',
  en: 'The options of `framework()`, and the files `src/routes/` may hold. How to use each is covered in the guides.',
});

export const frameworkSummary = message({
  ja: 'アプリをファイルに書き出すViteのプラグインです。ReactのプラグインとRSCのパイプラインを含んだ配列を返すので、`plugins`にそのまま渡します。',
  en: 'The Vite plugin that builds the application into files. It returns an array that includes React’s plugin and the RSC pipeline; put it in `plugins` as it is.',
});

export const frameworkRoutesDir = message({
  ja: 'ルートのディレクトリです。プロジェクトのルートからの相対パスで、既定は`src/routes`です。変えても、生成されるファイルは`.k8ordo/`に書かれます。',
  en: 'The route directory, relative to the project root; `src/routes` by default. The generated files still go to `.k8ordo/`.',
});

export const frameworkPaths = message({
  ja: 'パラメータを持つルートのURLを返す関数です。値の要るパターンの一覧を受け取り、URLの配列かそのPromiseを返します。URLにはViteの`base`を含めません。',
  en: 'A function that returns the URLs of routes with parameters. It receives the patterns that need values, and returns an array of URLs or a promise of one, without Vite’s `base`.',
});

export const frameworkSite = message({
  ja: 'サイトの配信元です（`https://example.com`）。渡すと、ビルドが`sitemap.xml`も書きます。`route.ts`が受け取る`request.url`のoriginも、この配信元になります。',
  en: 'The origin the site is served from, such as `https://example.com`. With it the build writes `sitemap.xml` too, and a `route.ts` sees it as the origin of `request.url`.',
});

export const frameworkCsp = message({
  ja: '各ページに書くContent-Security-Policyで、ディレクティブごとにソースの配列を渡します。ビルドがフレームワークのスクリプトのハッシュを足して、`<meta>`に書きます。',
  en: 'The Content-Security-Policy every page carries, as an array of sources per directive. The build adds the hashes of the framework’s scripts and writes it into a `<meta>`.',
});

export const frameworkReturns = message({
  ja: 'Viteのプラグインの配列。',
  en: 'An array of Vite plugins.',
});

export const frameworkCaveats = [
  message({
    ja: "`csp`に`<meta>`では効かないディレクティブか`'strict-dynamic'`を渡すと、`framework()`を呼んだ時点で例外を投げます。",
    en: "`framework()` throws as it is called when `csp` holds a directive a `<meta>` ignores, or `'strict-dynamic'`.",
  }),
] as const;

export const notFoundNote = message({
  ja: 'このモードでは`404.html`に書き出されるので、アプリに1つだけ置けます。',
  en: 'In this mode it is written as `404.html`, so an application may hold only one.',
});

export const redirectNote = message({
  ja: 'このモードでは、訪問者を行き先へ送るページとして書き出されます。',
  en: 'In this mode it is written as a page that sends the visitor on.',
});

export const routeNote = message({
  ja: 'このモードでは`GET`だけをexportでき、その答えがURLのファイルとして書き出されます。',
  en: 'In this mode it may export `GET` only, and what that answers is written as the file at its URL.',
});

export const guardNote = message({
  ja: 'このモードでは置けません。ビルドも`vite dev`も、名指しで拒みます。',
  en: 'Not in this mode: the build and `vite dev` both refuse it by name.',
});
