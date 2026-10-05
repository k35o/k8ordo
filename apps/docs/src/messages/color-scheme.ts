import { message } from '@k8ordo/i18n';

export const description = message({
  ja: 'アプリの配色を受け持ちます。訪問者が選んだ設定（ライト、ダーク、または未設定）をlocalStorageに保存し、OSの設定と合わせて`<html>`の`dark`クラスに反映します。ルートレイアウトに置く1つのプロバイダが、最初の描画の前に走るスクリプトも、その後の追従も担います。',
  en: 'Owns the colour-scheme axis of an application. The visitor’s preference (light, dark, or nothing, which follows the default: the system unless told otherwise) lives in localStorage, is resolved against the system, and becomes the `dark` class on `<html>`. One provider in the root layout renders the inline script that puts it there before the first paint and keeps it there after hydration; a hook reads it.',
});

export const tagline = message({
  ja: 'ダークモードを、最初の描画からちらつかせずに切り替えるライブラリ。',
  en: 'Dark mode that is right from the first paint, with no flash.',
});

export const claimNoFlashTitle = message({
  ja: '暗いページは、最初の描画から暗い',
  en: 'A dark page is dark from the first paint',
});

export const claimNoFlashBody = [
  message({
    ja: 'プロバイダは、ほかの何よりも先にインラインのスクリプトを描きます。このスクリプトが保存された設定を読み、最初の描画の前に`<html>`へ`dark`クラスを付けます。',
    en: 'The provider renders an inline script ahead of everything else. It reads the saved preference and puts the `dark` class on `<html>` before the first paint.',
  }),
  message({
    ja: '何も選んでいない訪問者には、OSの設定に合わせた配色を出します。`@k8ordo/ui`の色は、このクラスで切り替わります。',
    en: 'A visitor who never chose follows the system setting. `@k8ordo/ui`’s colours switch on that class.',
  }),
] as const;

export const claimCspTitle = message({
  ja: 'CSPの下でも、許可するのはこのスクリプトだけ',
  en: 'Under a CSP, allow this one script and nothing more',
});

export const claimCspBody = [
  message({
    ja: 'インラインのスクリプトは、nonceかハッシュで許可します。`@k8ordo/server`なら応答ごとの`nonce()`を渡します。ファイルにnonceを書けない`@k8ordo/static`なら、`colorSchemeScriptHash()`をポリシーに入れます。',
    en: 'The inline script is allowed by nonce or by hash. Under `@k8ordo/server`, pass the response’s `nonce()`; under `@k8ordo/static`, whose files cannot carry a nonce, put `colorSchemeScriptHash()` in the policy.',
  }),
  message({
    ja: '`unsafe-inline`で許可する必要はありません。ハッシュはインストールした版のスクリプトから毎回計算するので、更新しても古い値が残りません。',
    en: 'No `unsafe-inline` needed. The hash is computed from the installed script every time, so an update never leaves a stale value behind.',
  }),
] as const;

export const claimStorageTitle = message({
  ja: '設定はlocalStorageに1行だけ',
  en: 'The preference is one row in localStorage',
});

export const claimStorageBody = [
  message({
    ja: '選んだ設定は、`@k8ordo/state`の`defineLocalState`で保存します。何も選んでいない訪問者の行は無く、既定値は保存しません。',
    en: 'The choice is stored through `@k8ordo/state`’s `defineLocalState`. A visitor who never chose has no row, and the default is never stored.',
  }),
  message({
    ja: 'そのため、あとから`defaultPreference`を変えれば、まだ選んでいない訪問者全員の表示が変わります。複数のタブを開いていても、設定は1つにそろいます。',
    en: 'Change `defaultPreference` later, and everyone who never chose moves with it. Every tab agrees on one preference.',
  }),
] as const;

export const demoTitle = message({
  ja: 'このサイトの配色を切り替える',
  en: 'Switch this site’s colour scheme',
});

export const demoDescription = message({
  ja: 'ヘッダーの切り替えボタンと同じ`useColorScheme()`を使っています。',
  en: 'The same `useColorScheme()` as the switch in the header.',
});

export const demoSteps = [
  message({
    ja: '「ダーク」を押してから、ページを再読み込みしてみてください。白く光ることなく、最初から暗いまま表示されます。',
    en: 'Press “Dark”, then reload the page. It comes back dark from the start, with no white flash.',
  }),
  message({
    ja: '「システム」を押してからOSの外観の設定を切り替えると、ページの配色もそれに合わせて変わります。',
    en: 'Press “System”, then change the appearance setting of your OS. The page follows it.',
  }),
  message({
    ja: 'このページを別のタブでも開いて選び直すと、こちらのタブの配色も変わります。',
    en: 'Open this page in another tab and choose again there. This tab changes too.',
  }),
] as const;

export const demoSystem = message({
  ja: 'システム',
  en: 'System',
});

export const demoLight = message({
  ja: 'ライト',
  en: 'Light',
});

export const demoDark = message({
  ja: 'ダーク',
  en: 'Dark',
});

export const nextGetStarted = message({
  ja: 'プロバイダを置き、切り替えのボタンを1つ作るところまでの手順です。',
  en: 'Place the provider and build one switch.',
});

export const nextStyling = message({
  ja: '`dark`クラスに色を当てる方法を、`@k8ordo/ui`とTailwind CSS、素のCSSのそれぞれで説明します。',
  en: 'Colouring under the `dark` class with `@k8ordo/ui`, Tailwind CSS, or plain CSS.',
});

export const nextSwitcher = message({
  ja: '2択のトグルと、「システム」を含む3択の作り方です。',
  en: 'A two-way toggle, and a three-way choice that includes the system.',
});

export const nextStorage = message({
  ja: '保存する行の中身と、フックを通さずに設定を読む方法です。',
  en: 'What the stored row holds, and reading it without the hook.',
});

export const nextCsp = message({
  ja: 'nonceやハッシュで、インラインのスクリプトを許可する方法です。',
  en: 'Allowing the inline script by nonce or by hash.',
});

export const nextHowItWorks = message({
  ja: '配色を決める規則と、ハイドレーションの前後で何が起きるかです。',
  en: 'The rule that decides the scheme, and what happens around hydration.',
});

export const navStyling = message({
  ja: 'スタイル',
  en: 'Styling',
});

export const navSwitcher = message({
  ja: '切り替えのボタンを作る',
  en: 'Build a switch',
});

export const navStorage = message({
  ja: '保存',
  en: 'Storage',
});

export const navCsp = message({
  ja: 'CSP',
  en: 'CSP',
});

export const navTesting = message({
  ja: 'テストする',
  en: 'Testing',
});

export const navHowItWorks = message({
  ja: '仕組み',
  en: 'How it works',
});
