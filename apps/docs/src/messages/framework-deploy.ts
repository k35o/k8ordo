import { message } from '@k8ordo/i18n';

// 両モードに共通する、デプロイの前に開いていたタブと、サブパスでの配信の
// 説明。モードごとに違う部分は static-deploy.ts / server-deploy.ts が持つ。

export const tabsTitle = message({
  ja: 'デプロイの前に開いていたタブ',
  en: 'A tab opened before a deploy',
});

export const tabsDescription = message({
  ja: 'タブは読み込んだときのスクリプトを動かし続けますが、取りに行くペイロードは今デプロイされているものです。新しいデプロイが、そのスクリプトの知らないクライアントコンポーネントを描くこともあります。',
  en: 'A tab keeps running the script it loaded, while every payload it fetches comes from whatever is deployed now — and a new deploy may render a client component that script has never heard of.',
});

export const tabsCheck = message({
  ja: 'そこでペイロードには、それを描いたときのクライアントのスクリプトのURLが書かれています。タブのスクリプトと合わないペイロードは描かず、同じURLを文書として読み込み直します。訪問者が見るのは`error.tsx`ではなく、新しいスクリプトで描いた新しいページです。',
  en: 'So every payload names the client script it was rendered for. One that does not match the tab’s script is never rendered: the same URL is loaded as a document instead, and the visitor gets the new page with the script that can render it, rather than `error.tsx`.',
});

export const tabsSame = message({
  ja: 'スクリプトのURLには、スクリプトが読み込むものすべてのハッシュが入っています。そのため、ブラウザで動くものを何も変えなかったデプロイなら、開いているタブはそのまま遷移を続けます。',
  en: 'The script’s URL carries a hash of everything it can load, so a deploy that changed nothing the browser runs leaves every open tab navigating in place.',
});

export const baseTitle = message({
  ja: 'サブパスで配信する',
  en: 'Serve under a subpath',
});

export const baseDescription = message({
  ja: '`https://example.com/docs/`のように、originの直下ではない場所で配信するときは、Viteの`base`で伝えます。アプリのほかの部分は何も変わりません。',
  en: 'To serve below the root of an origin, such as `https://example.com/docs/`, say so with Vite’s `base`. Nothing else in the application changes.',
});

export const baseRoot = message({
  ja: '`routes/`は、今までどおりアプリのルートから書きます。`routes/products/page.tsx`は、ルート表では`/products`で、アドレスバーでは`/docs/products`です。2つの間を行き来するものには、次のように`base`が付いたり外れたりします。',
  en: '`routes/` is still written from the application’s root: `routes/products/page.tsx` is `/products` in the route table and `/docs/products` in the address bar. What moves between the two gains or loses the base like this:',
});

export const baseList = [
  message({
    ja: '`href()`と`navigateTo()`：返すURLに`base`が付きます。',
    en: '`href()` and `navigateTo()`: the URL they return carries the base.',
  }),
  message({
    ja: '`pathname`と`usePathname()`：`base`を外した値です。',
    en: '`pathname` and `usePathname()`: the value without the base.',
  }),
  message({
    ja: 'ペイロードとクライアントのファイル：`/docs/products/index.rsc`や`/docs/assets/`のように、`base`の下に置かれます。',
    en: 'Payloads and client files: below the base, as `/docs/products/index.rsc` and `/docs/assets/`.',
  }),
  message({
    ja: '`redirect.ts`の行き先：ルート表と同じくアプリのルートから書き、送るときに`base`が付きます。別のoriginを書いた行き先は、そのまま送ります。',
    en: 'A `redirect.ts` target: written from the root like the table, and sent with the base in front. One naming another origin is sent as written.',
  }),
  message({
    ja: '`base`の外のURL：アプリのものではないので、ハンドラは`404`で答え、クライアントのランタイムはブラウザに任せます。',
    en: 'A URL outside the base: not the application’s, so the handler answers `404` and the client runtime leaves it to the browser.',
  }),
] as const;

export const baseRefused = message({
  ja: "`base`はルートから始まるパスにします。`./`のような相対パスや別のoriginでは、どのURLがどのページかが決まらないので、ビルドが`k8ordo serves its pages under Vite's base, so base has to be a path from the root`で始まるエラーで止まります。",
  en: "`base` has to be a path from the root. A relative one like `./`, or another origin, says nothing about which URL is which page, so the build stops with an error that begins `k8ordo serves its pages under Vite's base, so base has to be a path from the root`.",
});
