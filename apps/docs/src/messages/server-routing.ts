import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: '`src/routes/`の下のディレクトリが、そのままアプリのURLになります。このページでは、ルートを書くときの決まりと、ルートのファイルでできることを説明します。',
  en: 'The directories under `src/routes/` are the application’s URLs. This page covers the rules for writing routes, and what route files can do.',
});

export const guardFile = message({
  ja: '`guard.ts`：その下のURLに答える前に走り、リクエストを止めたり通したりします。',
  en: '`guard.ts`: runs before any URL below it is answered, and stops the request or lets it through.',
});

export const propsRequest = message({
  ja: 'このモードでは、ページとレイアウトは`request`も受け取ります。リクエストのヘッダーとCookieが入っていて、読み方は次のページで説明しています。',
  en: 'In this mode a page and a layout also receive `request`, holding the request’s headers and cookies. Reading it is covered here:',
});

export const refusesMode = message({
  ja: 'このモードで、`routes/`の形が原因でビルドが止まるのは上の場合だけです。パラメータの値はリクエストと一緒に届くので、並べるように求められることもありません。',
  en: 'In this mode these are the only reasons the shape of `routes/` stops the build. Parameter values arrive with the request, so nothing asks for them to be listed.',
});

export const loadingMode = message({
  ja: 'このモードでは、ページ自身のコンポーネントが答えを返すまで、文書を送りません。ページが`notFound()`を投げるかもしれず、まだステータスが決まらないからです。そのためHTMLに`loading.tsx`が出るのは、ページが自分の`<Suspense>`の下に置いた部分を待つ間だけです。',
  en: 'In this mode a document is not sent until the page’s own component has answered: the page may still throw `notFound()`, and the status is not settled. So in the HTML a `loading.tsx` shows only for what the page put under a `<Suspense>` of its own.',
});

export const loadingNav = message({
  ja: 'クライアント側の遷移ではステータスを待たないので、ペイロードが届くまでの間に`loading.tsx`が出ます。',
  en: 'A client navigation has no status to wait for, so it shows `loading.tsx` while the payload streams in.',
});

export const routeMode = message({
  ja: 'このモードでは、HTTPの7つのメソッドのどれをexportしても構いません。exportしていないメソッドには、exportしたものを`Allow`に並べた`405`で答えます。`HEAD`をexportしていなければ、`GET`の答えから本文を外して返します。',
  en: 'In this mode any of the seven HTTP methods may be exported. A method it does not export gets a `405` whose `Allow` lists the ones it does, and without a `HEAD` of its own, the `GET` answer goes back with its body left off.',
});

export const routeGuard = message({
  ja: '上にある`guard.ts`は、`route.ts`より先に走ります。`route.ts`への`POST`は、Server Actionと違って同じoriginかどうかを確かめません。Webhookのように、別の場所から送られてくるものだからです。必要な検証は、`route.ts`の中で行います。',
  en: 'The `guard.ts` files above it run first. A `POST` to a `route.ts` is not checked for the same origin, unlike a Server Action’s: what posts there, a webhook, comes from elsewhere. Check what you need inside the `route.ts`.',
});

export const routeApi = message({
  ja: '`route.ts`もリクエストに答える側なので、`cookies()`と`responseHeaders()`、`requestHeaders()`が使えます。',
  en: 'A `route.ts` answers the request, so `cookies()`, `responseHeaders()` and `requestHeaders()` work inside it.',
});

export const generatedMode = message({
  ja: 'このモードの`register.gen.ts`は、ルートのファイルが`request`を受け取ることも`Register`に書きます。`PageProps`に`request`があるのは、このためです。',
  en: 'In this mode `register.gen.ts` also writes into `Register` that route files receive `request`, which is how `PageProps` comes to carry it.',
});

export const prefetchMode = message({
  ja: 'このモードでの先読みは、遷移と同じくサーバーでの描画です。描くのが重いページへのリンクで先読みを止めるのは、このためです。',
  en: 'In this mode a prefetch is a render on the server, as a navigation is — the reason to stop it for a link to an expensive page.',
});
