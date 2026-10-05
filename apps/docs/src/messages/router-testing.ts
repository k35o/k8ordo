import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'このルーターは何もモックせず、ブラウザのNavigation APIとURLPatternをそのまま使います。このページでは、ブラウザ無しで確かめられる部分と、ブラウザの中でナビゲーションを確かめるときの注意を説明します。',
  en: 'This router mocks nothing: it uses the browser’s Navigation API and URLPattern as they are. This page covers what can be checked without a browser, and what to watch for when checking navigation inside one.',
});

export const matchTitle = message({
  ja: 'ルート表をブラウザ無しで確かめる',
  en: 'Check the route table without a browser',
});

export const matchDescription = message({
  ja: '`defineRoutes`が返すルート表は、`match`でパスを照合できます。`match`はただの関数です。そのため、どのパスがどのページになるかや受け取るparams、照合の順序を、ブラウザ無しで確かめられます。',
  en: 'The route table `defineRoutes` returns matches a path with `match`. It is a plain function, so which page a path lands on, the params it takes and the order patterns match in can all be checked without a browser.',
});

export const matchPure = message({
  ja: '`matchPath`も同じく、ブラウザ無しで呼べる関数です。いまいる場所によってリンクの見た目を変えるコードは、パスを引数で受け取る形にしておくと、`matchPath`ごと確かめられます。',
  en: '`matchPath` is likewise a function you can call without a browser. Code that marks a link by where you are can take the path as an argument, and be checked along with `matchPath`.',
});

export const browserTitle = message({
  ja: 'ブラウザの中でページを移る',
  en: 'Change pages inside a browser',
});

export const browserDescription = message({
  ja: '`<Router>`を描いてページを移るテストは、Navigation APIのあるブラウザの中で動かします。このパッケージ自身のテストは、VitestのブラウザモードでChromiumとFirefox、WebKitの3つを使っています。',
  en: 'A test that renders `<Router>` and changes pages runs inside a browser with the Navigation API. This package’s own tests use Vitest’s browser mode on Chromium, Firefox and WebKit.',
});

export const browserFinished = message({
  ja: '`finished`は新しいページが画面に出たときに解決するので、待ったあとは、繰り返し確かめる書き方をしなくても画面を確かめられます。',
  en: '`finished` resolves once the new page is on screen, so after awaiting it the screen can be checked straight away, with no retrying.',
});

export const browserEffects = message({
  ja: 'ただし、ページの`useEffect`は、画面に出たあとで走ります。effectの結果を確かめるときは、`expect.element`や`vi.waitFor`のように、通るまで繰り返す書き方にしてください。',
  en: 'A page’s `useEffect` runs after it is on screen, though. To check what an effect did, use a form that retries until it passes, such as `expect.element` or `vi.waitFor`.',
});

export const interceptTitle = message({
  ja: '表の外へ移るときはテストが自分で引き受ける',
  en: 'Intercept navigations outside the table yourself',
});

export const interceptDescription = message({
  ja: '`<Router>`が引き受けないナビゲーションは、ブラウザのふつうのページの読み込みになります。テストの中でそれが起きると、テストを動かしているページそのものが別のページに移ってしまいます。',
  en: 'A navigation `<Router>` does not take becomes an ordinary page load. Inside a test, that moves the very page the tests run in somewhere else.',
});

export const interceptWhen = message({
  ja: 'テストの前に表に無いURLへ移る準備や、テストのあとで元のURLに戻す後片付けが、これにあたります。そうしたナビゲーションの間だけ、テストが自分で`navigate`イベントをインターセプトします。',
  en: 'Moving to a URL outside the table before a test, or back to the original URL afterwards, is exactly that. For those navigations only, the test intercepts the `navigate` event itself.',
});

export const interceptRouter = message({
  ja: '`<Router>`を描いたあとの、表にあるパスへのナビゲーションは、`<Router>`が引き受けます。テストが自分で引き受ける必要はありません。',
  en: 'Once `<Router>` is rendered, it takes navigations to paths in the table itself; the test has nothing to intercept there.',
});

export const traverseTitle = message({
  ja: '戻ると進むはトップレベルのページで確かめる',
  en: 'Check back and forward in a top-level page',
});

export const traverseDescription = message({
  ja: 'Vitestのブラウザモードは、テストをiframeの中で動かします。iframeの中では、FirefoxとWebKitは戻ると進むでスクロールの位置を戻しません。また、Firefoxは戻るときのハンドラを2回走らせます。',
  en: 'Vitest’s browser mode runs a test inside an iframe. There, Firefox and WebKit do not restore the scroll position on back and forward, and Firefox runs a traversal’s handler twice.',
});

export const traversePlaywright = message({
  ja: 'そのためこのパッケージでは、戻ると進むのテストだけを、Playwrightでトップレベルに開いたページで行っています。戻ったときのスクロールの位置まで確かめるなら、同じようにiframeの外で確かめてください。',
  en: 'This package therefore checks going back and forward only in a top-level page it opens with Playwright. To check the scroll position after going back, do the same and leave the iframe.',
});
