import { message } from '@k8ordo/i18n';

// 両モードに共通する、フレームワークが署名するものの説明。ポリシーの
// 書き方はモードで違うので static-csp.ts / server-csp.ts が持つ。

export const signedTitle = message({
  ja: 'フレームワークが署名するもの',
  en: 'What the framework signs',
});

export const signedDescription = message({
  ja: 'フレームワークはポリシーを決めません。自分がHTMLに書くインラインスクリプトに署名するだけで、それを許すポリシーはアプリが書きます。',
  en: 'The framework decides no policy. It signs the inline scripts it writes into the HTML, and the policy that allows them is the application’s to write.',
});

export const signedScripts = message({
  ja: 'フレームワークが書くインラインスクリプトは、hydrationのためにHTMLへ埋め込むペイロードと、Reactのスクリプトです。',
  en: 'The inline scripts the framework writes are the payload it puts into the HTML for hydration, and React’s own.',
});

export const signedOwn = message({
  ja: 'アプリが自分で書くインラインスクリプトも、同じようにポリシーで許します。`@k8ordo/color-scheme`が描画の前に色を決めるスクリプトも、その1つです。',
  en: 'An inline script the application writes itself is allowed by the policy the same way — `@k8ordo/color-scheme`’s, which sets the colours before the first paint, among them.',
});
