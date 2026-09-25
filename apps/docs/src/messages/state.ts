import { message } from '@k8ordo/i18n';

export const description = message({
  ja: '状態を「どこに住むか」で宣言します。置き場所は URL の searchParams・履歴エントリ・localStorage・sessionStorage・Cookie・メモリです。メモリ以外はそれぞれ zod スキーマ1つで型付けし、サーバーの読み取り・リンク生成・購読までそこから導きます。境界を越えないメモリは、スキーマを持たない型付きの箱です。',
  en: 'Declare state by where it lives — URL search params, the history entry, localStorage, sessionStorage, a cookie, memory. Every place but memory is typed by one zod schema, from which the server read, link building and the subscription are all derived; memory never crosses a boundary, so it is a typed box with no schema.',
});

export const demoTitle = message({
  ja: 'このページで動いています',
  en: 'Running on this very page',
});

export const demoDescription = message({
  ja: '下の操作は本物のURLを書き換えます。`definePageState` の update がこのサイトのルーター（Navigation API を intercept する @k8ordo/router）を通って流れます。ヘッダーのテーマ切り替え（`@k8ordo/color-scheme`）の保存先も `defineLocalState` で、その現在値が color-scheme の行です。',
  en: 'The controls below rewrite the real URL: `definePageState` updates flow through this site’s router (@k8ordo/router, which intercepts the Navigation API). The theme toggle in the header (`@k8ordo/color-scheme`) stores through `defineLocalState` — its current value is the color-scheme row.',
});

export const demoUrlEmpty = message({
  ja: 'クエリなし（すべて default）',
  en: 'no query (all defaults)',
});

export const demoThemeSystem = message({
  ja: 'システムに追従',
  en: 'following the system',
});

export const demoHint = message({
  ja: 'page の増減は push なので、ブラウザの戻るで1つずつ巻き戻ります。tab は replace で、現在のエントリを書き換えます。URL をコピーすれば、この状態ごと共有できます。URL に `?page=0` と手で書いても、スキーマが default に落とします。',
  en: 'The page steppers push, so the browser back button rewinds them one by one. The tabs replace, refining the current entry. Copy the URL and the state travels with it. Hand-edit `?page=0` into the URL and the schema drops it to the default.',
});

export const featuresTitle = message({
  ja: '特徴',
  en: 'Features',
});

export const featurePlaces = message({
  ja: '置き場所で宣言する',
  en: 'Declared by where it lives',
});

export const featurePlacesDescription = message({
  ja: 'URL・履歴エントリ・localStorage・sessionStorage・Cookie・メモリ。状態の寿命と共有範囲を決めるのはコードの書き方ではなく、定義した場所です。',
  en: 'URL, history entry, localStorage, sessionStorage, a cookie, memory. Lifetime and sharing scope are decided by the place you declared, not by how the code happens to be written.',
});

export const featureSchema = message({
  ja: '出所はスキーマ1つ',
  en: 'One source: the schema',
});

export const featureSchemaDescription = message({
  ja: 'parseUrl・リンク生成・古いデータのサルベージまで、書いたスキーマから導かれます。検索フォームの制約（@k8ordo/form）と同じスキーマを共有できます。',
  en: 'parseUrl, link building and the salvage of stale data all derive from the schema you wrote. A search form can share the very same schema with @k8ordo/form.',
});

export const featureNavigation = message({
  ja: 'Navigation APIに載る',
  en: 'Rides the Navigation API',
});

export const featureNavigationDescription = message({
  ja: 'URLと隠れたエントリ状態は、同じ履歴エントリの2つの面です。1回の navigate で原子的に更新され、戻るで両方が一緒に戻ります。',
  en: 'The URL and the hidden entry state are two faces of one history entry: updated atomically in a single navigate, restored together by the back button.',
});

export const featureKeys = message({
  ja: 'キー単位の購読',
  en: 'Subscribe per key',
});

export const featureKeysDescription = message({
  ja: '購読するキーを列挙すれば、それ以外のフィールドの更新では再レンダーされません。定義がキー集合を固定しているので、判定は正確です。',
  en: 'List the keys you read and updates to any other field never re-render you. The definition fixes the key set, so change detection is exact.',
});

export const featureCanonical = message({
  ja: '不正な値は表示されない',
  en: 'Invalid values never render',
});

export const featureCanonicalDescription = message({
  ja: 'update はその場でスキーマを通り、URL に手で書かれた不正値は default に落ちます。default の値はクエリから省かれるので、同じ状態は常に同じ URL になります。',
  en: 'update passes the schema on the spot, and a hand-edited URL param falls back to its default. Defaults are omitted from the query, so the same state always makes the same URL.',
});

export const featureServer = message({
  ja: 'サーバーが読める',
  en: 'The server can read it',
});

export const featureServerDescription = message({
  ja: 'ページに search を渡すルーター（Next.js など）なら、URL 状態は RSC が parseUrl で型付きに読めます。@k8ordo/static / @k8ordo/server では、ブラウザで読みます。リンクと GET フォームは、どのルーターでも JavaScript の読み込み前から URL を書き換えます。Cookie に置いた好みは、@k8ordo/server のページが parseCookies でリクエストから読むので、既定値がちらつきません。',
  en: 'Where the router hands a page its search (Next.js, say), an RSC reads URL state typed via parseUrl; under @k8ordo/static / @k8ordo/server it is read in the browser. Links and GET forms change the URL under any router, before JavaScript loads. A preference kept in a cookie is read from the request with parseCookies under @k8ordo/server, so its default never flashes.',
});

export const docsTitle = message({
  ja: 'ドキュメント',
  en: 'Documentation',
});

export const docsDescription = message({
  ja: '設計ガイドは npm パッケージに同梱されています。AIコーディングエージェントは `node_modules/@k8ordo/state/docs/` からインストールした版そのものを読みます。',
  en: 'The guide ships inside the npm package. An AI coding assistant reads the exact installed version out of `node_modules/@k8ordo/state/docs/`.',
});

export const navPlaces = message({
  ja: '置き場所',
  en: 'Places',
});

export const navReading = message({
  ja: '読み取りとリンク',
  en: 'Reading & links',
});

export const navUpdates = message({
  ja: '更新',
  en: 'Updates',
});

export const navIntegrations = message({
  ja: '組み合わせ',
  en: 'Integrations',
});
