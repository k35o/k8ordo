import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '日本語と英語のページを持つ小さなアプリを作りながら、`@k8ordo/i18n`の使い方を最初から最後までたどります。ロケールの一覧は1か所に書き、`[locale]`の区間で受け取ります。最初の文言は、Server ComponentとClient Componentの両方で描きます。',
  en: 'Build a small app with Japanese and English pages, from start to finish. You list the locales in one place, accept them on the `[locale]` segment, and render a first message from a Server Component and from a Client Component.',
});

export const installTitle = message({
  ja: 'インストールする',
  en: 'Install',
});

export const installDescription = message({
  ja: '`@k8ordo/i18n`をインストールします。実行時に読み込むパッケージはほかにありません。Reactもスキーマのライブラリもimportしないためです。',
  en: 'Install `@k8ordo/i18n`. Nothing else is loaded at run time: it imports neither React nor a schema library.',
});

export const runtimeNote = message({
  ja: 'サーバーでは、描画中のロケールを`AsyncLocalStorage`に置きます。`process.getBuiltinModule`でこれを取り出せるランタイムが必要です。`@k8ordo/framework`が求めるNode 24は、この条件を満たします。',
  en: 'On a server the locale of the render in progress lives in `AsyncLocalStorage`, so the runtime has to hand it out through `process.getBuiltinModule`. Node 24, which `@k8ordo/framework` requires, does.',
});

export const localesTitle = message({
  ja: 'ロケールの一覧を書く',
  en: 'List the locales',
});

export const localesDescription = message({
  ja: 'まず、アプリが扱うロケールを`defineLocales`で書きます。ロケールごとに、日付を表示するタイムゾーン（`timeZone`）と文字の向き（`dir`）を添えます。',
  en: 'First, list the locales the app supports with `defineLocales`. Each one states the time zone its dates are shown in (`timeZone`) and the direction its text runs in (`dir`).',
});

export const localesDefault = message({
  ja: '先頭に書いた`ja`が既定のロケールです。URLにロケールが無いときなど、何もロケールを指名していないときは、既定のロケールで文言を描きます。',
  en: 'The `ja` written first is the default locale. When nothing names a locale, such as a URL without one, messages render in the default.',
});

export const localesRegister = message({
  ja: '後半の`Register`は、ロケールの型をパッケージに伝える宣言です。これを書くと、このあと書く文言がすべてのロケールの文を求めるようになります。`Register`はマージされるための型なので、`interface`で書きます。',
  en: 'The `Register` block at the end tells the package your locales’ type. With it, every message you write next has to carry text for every locale. `Register` exists to be merged, so it is an `interface`.',
});

export const segmentTitle = message({
  ja: '`[locale]`の区間で受け取る',
  en: 'Accept the locale on the `[locale]` segment',
});

export const segmentDescription = message({
  ja: '次に、すべてのページを`src/routes/[locale]/`の下に置き、その区間のレイアウトから`paramsSchema`をexportします。`/ja/…`と`/en/…`だけが受け付けられ、受け付けたロケールがそのページの描画のロケールになります。',
  en: 'Next, put every page under `src/routes/[locale]/` and export `paramsSchema` from that segment’s layout. Only `/ja/…` and `/en/…` are accepted, and the accepted locale becomes the locale that page renders in.',
});

export const segmentRefuse = message({
  ja: '一覧に無い`/fr/…`は、このパターンが答えないURLになり、最後は`not-found.tsx`が404で答えます。スキーマはロケールの一覧が自分で作るので、スキーマのライブラリは要りません。',
  en: 'A URL such as `/fr/…`, outside the list, is one this pattern does not answer, and in the end `not-found.tsx` answers it with a 404. The locale set builds the schema itself, so no schema library is needed.',
});

export const segmentPitfall = message({
  ja: "このレイアウトに`'use client'`を付けてはいけません。付けると、exportしたスキーマはclient referenceとしてフレームワークに渡り、スキーマとして読めなくなります。フックを使う枠が要るときは、`src/components/`のClient Componentに分けて、レイアウトから描きます。",
  en: "Do not mark this layout `'use client'`: the schema it exports would then reach the framework as a client reference, which cannot be read as a schema. If the frame needs hooks, move it into a Client Component under `src/components/` and render that from the layout.",
});

export const messagesTitle = message({
  ja: '文言を書く',
  en: 'Write the messages',
});

export const messagesDescription = message({
  ja: '文言は`message`で1つずつ書き、ロケールごとの文を並べます。値を差し込む文言は、ロケールごとの関数にします。',
  en: 'Write each message with `message`, giving its text for every locale. A message that takes a value is a function in every locale.',
});

export const messagesTypes = message({
  ja: '`greeting`の引数の型は、`ja`に書いた注釈から決まります。`en`も同じ型で書くよう求められ、どちらかのロケールを書き忘れると、その宣言が型エラーになります。',
  en: 'The type of `greeting`’s argument comes from the annotation on `ja`, and `en` is held to it. Leave out either locale, and the declaration fails to compile.',
});

export const serverTitle = message({
  ja: 'Server Componentで描く',
  en: 'Render from a Server Component',
});

export const serverDescription = message({
  ja: '文言は呼ぶだけで、そのページのロケールの文を返します。サーバーでは、`[locale]`のスキーマが受け付けたロケールを読むので、`/en/`の下では英語の文になります。',
  en: 'Call a message and it returns the text in the page’s locale. On the server it reads the locale the `[locale]` schema accepted, so under `/en/` the text is English.',
});

export const clientTitle = message({
  ja: 'Client Componentで描く',
  en: 'Render from a Client Component',
});

export const clientDescription = message({
  ja: 'Client Componentでも書き方は同じです。ブラウザではURLの先頭の区間を読むので、プロバイダでロケールを渡す必要も、フックで読み出す必要もありません。',
  en: 'A Client Component calls it the same way. In the browser it reads the first segment of the URL, so there is no provider to pass the locale down and no hook to read it with.',
});

export const clientBoundary = message({
  ja: 'Server ComponentからClient Componentへpropsで文言を渡すときは、呼んだ結果の文字列を渡します。関数はpropsとしてClient Componentに渡せないためです。詳しくは「文言を書く」で説明します。',
  en: 'To hand text from a Server Component to a Client Component as a prop, pass the string you get by calling the message: a function cannot be passed to a Client Component as a prop. “Write messages” covers this.',
});

export const nextTitle = message({
  ja: '次のステップ',
  en: 'Next steps',
});

export const nextMessages = message({
  ja: '値を差し込む文言の書き方と、文言をpropsで渡す方法を知る。',
  en: 'Write messages that take values, and pass them around as props.',
});

export const nextSwitch = message({
  ja: '言語を切り替えるリンクを作り、選んだ言語を覚えておく。',
  en: 'Build a language switcher, and remember the choice.',
});

export const nextNegotiate = message({
  ja: '`/`を開いた人を、その人の言語のページへ送る。',
  en: 'Send whoever opens `/` to the page in their language.',
});
