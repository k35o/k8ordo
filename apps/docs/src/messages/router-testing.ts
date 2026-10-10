import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'ルート表の`match`はNodeで、`<Router>`を描画してページを移るテストはブラウザで書けるようになります。ルート表に無いURLへ移るときと、履歴の移動を確かめるときの注意もわかります。',
  en: 'You will be able to test a route table’s `match` under Node and test page changes through `<Router>` in a browser. You will also know what to watch for when moving to a URL outside the route table and when checking history traversal.',
});

export const matchTitle = message({
  ja: 'ルート表のテスト',
  en: 'Route table tests',
});

export const matchPure = message({
  ja: '`defineRoutes`が返すルート表の`match`は、ブラウザ無しで動く関数です。どのパターンに当たるかと受け取る`params`を、Nodeで動くふつうのテストで確かめられます。照合の順序も同じように確かめられます。',
  en: 'The `match` of the route table `defineRoutes` returns is a plain function that needs no browser. Which pattern a path matches, the `params` it yields, and the order patterns are tried in can all be checked by an ordinary test under Node.',
});

export const matchPath = message({
  ja: '`matchPath`も同じです。今のパスによってリンクの見た目を変えるコードは、パスを引数で受け取る形にするとNodeで確かめられます。',
  en: '`matchPath` is the same. Code that styles a link by the current path can take the path as an argument, and then it can be tested under Node too.',
});

export const browserTitle = message({
  ja: 'ブラウザでのテスト',
  en: 'Tests in a browser',
});

export const browserFinishedCallout = message({
  ja: '新しいページが画面に出るまで待つ',
  en: 'Waits until the new page is on screen',
});

export const browserRuns = message({
  ja: '`<Router>`を描画してページを移るテストは、Navigation APIのあるブラウザで動かします。このパッケージ自身はVitestのブラウザモードで、ChromiumとFirefox、WebKitでテストしています。',
  en: 'A test that renders `<Router>` and changes pages runs in a browser with the Navigation API. This package tests itself with Vitest’s browser mode on Chromium, Firefox and WebKit.',
});

export const browserFinished = message({
  ja: '`finished`は、新しいページが画面に出たときに解決します。待ったあとは、通るまで繰り返す書き方をしなくても画面を確かめられます。',
  en: '`finished` resolves once the new page is on screen. After awaiting it, the screen can be checked without retrying.',
});

export const browserEffects = message({
  ja: 'ページの`useEffect`は、画面に出たあとに走ります。`useEffect`の結果は、`expect.element`や`vi.waitFor`のように通るまで繰り返す書き方で確かめます。',
  en: 'A page’s `useEffect` runs after the page is on screen. Check what an effect did with a form that retries until it passes, such as `expect.element` or `vi.waitFor`.',
});

export const interceptTitle = message({
  ja: 'ルート表に無いURL',
  en: 'URLs outside the route table',
});

export const interceptLoad = message({
  ja: '`<Router>`が扱わないナビゲーションは、ブラウザのふつうのページの読み込みになります。テストの中で起きると、テストを動かしているページごと移動してしまいます。',
  en: 'A navigation `<Router>` does not handle becomes an ordinary page load. Inside a test, it navigates the page that runs the tests away from the runner.',
});

export const interceptWhen = message({
  ja: 'テストの前にルート表に無いURLへ移るときと、テストのあとに元のURLへ戻すときのナビゲーションがこれにあたります。その間だけ`navigate`イベントにリスナーを追加して、テスト自身が`intercept()`します。終わったら`removeEventListener`で外します。',
  en: 'Moving to a URL outside the route table before a test, and back to the original URL after it, are such navigations. For those only, the test adds a `navigate` listener and calls `intercept()` itself. When done, `removeEventListener` takes the listener off.',
});

export const interceptRouter = message({
  ja: '`<Router>`を描画したあとの、ルート表にあるパスへのナビゲーションは`<Router>`が扱います。テストが`intercept()`する必要はありません。',
  en: 'Once `<Router>` is rendered, it handles navigations to paths in the route table. The test does not need to call `intercept()` for those.',
});

export const traverseTitle = message({
  ja: '履歴の移動',
  en: 'History traversal',
});

export const traverseIframe = message({
  ja: 'Vitestのブラウザモードは、テストをiframeの中で動かします。iframeの中では、FirefoxとWebKitは履歴を移動してもスクロールの位置を戻しません。Firefoxは履歴の移動のハンドラを2回走らせます。',
  en: 'Vitest’s browser mode runs a test inside an iframe. There, Firefox and WebKit do not restore the scroll position on back and forward. Firefox also runs the traversal handler twice.',
});

export const traversePlaywright = message({
  ja: 'このパッケージは、履歴の移動のテストだけをPlaywrightでトップレベルに開いたページで行っています。戻ったときのスクロールの位置まで確かめるなら、同じようにiframeの外で確かめてください。',
  en: 'This package runs only its back and forward tests in a top-level page opened with Playwright. To check the scroll position after going back, do the same and test outside the iframe.',
});
