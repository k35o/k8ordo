import { message } from '@k8ordo/i18n';

export const description = message({
  ja: 'アプリケーションのカラースキーム軸を持つ。訪問者の設定（light / dark / 未設定＝既定値に従い、既定ではシステム追従）を localStorage に置き、システムの設定と突き合わせて `<html>` の `dark` クラスに解決する。ルートレイアウトに置く 1 つの Provider が、最初の描画の前に付けるインラインスクリプトの描画も、hydrate 後の追従も担い、hook はそれを読むだけ。',
  en: 'Owns the colour-scheme axis of an application. The visitor’s preference (light, dark, or nothing, which follows the default: the system unless told otherwise) lives in localStorage, is resolved against the system, and becomes the `dark` class on `<html>`. One provider in the root layout renders the inline script that puts it there before the first paint and keeps it there after hydration; a hook reads it.',
});

export const tagline = message({
  ja: 'ダークモードを、最初の描画からちらつかせずに切り替える。',
  en: 'Dark mode that is right from the first paint, with no flash.',
});

export const claimNoFlashTitle = message({
  ja: '暗いページは、最初の描画から暗い',
  en: 'A dark page is dark from the first paint',
});

export const claimNoFlashBody = [
  message({
    ja: 'プロバイダは、ほかの何よりも先にインラインのスクリプトを描きます。スクリプトは保存された設定を読み、最初の描画の前に `<html>` へ `dark` クラスを付けます。',
    en: 'The provider renders an inline script ahead of everything else. It reads the saved preference and puts the `dark` class on `<html>` before the first paint.',
  }),
  message({
    ja: '何も選んでいない人は、OS の設定に追従します。`@k8ordo/ui` の色は、このクラスで切り替わります。',
    en: 'A visitor who never chose follows the system setting. `@k8ordo/ui`’s colours switch on that class.',
  }),
] as const;

export const claimCspTitle = message({
  ja: 'CSP の下でも、許すのはこのスクリプトだけ',
  en: 'Under a CSP, allow this one script and nothing more',
});

export const claimCspBody = [
  message({
    ja: 'インラインのスクリプトは、nonce かハッシュで許します。`@k8ordo/server` なら応答の `nonce()` を渡し、ファイルに nonce を書けない `@k8ordo/static` なら `colorSchemeScriptHash()` をポリシーに入れます。',
    en: 'The inline script is allowed by nonce or by hash. Under `@k8ordo/server`, pass the response’s `nonce()`; under `@k8ordo/static`, whose files cannot carry a nonce, put `colorSchemeScriptHash()` in the policy.',
  }),
  message({
    ja: '`unsafe-inline` は要りません。ハッシュは入っている版のスクリプトから毎回計算するので、更新しても古い値が残りません。',
    en: 'No `unsafe-inline` needed. The hash is computed from the installed script every time, so an update never leaves a stale value behind.',
  }),
] as const;

export const claimStorageTitle = message({
  ja: '設定は localStorage の 1 行',
  en: 'The preference is one row in localStorage',
});

export const claimStorageBody = [
  message({
    ja: '選んだ設定は `@k8ordo/state` の `defineLocalState` で保存します。何も選んでいない人の行は無く、既定値は保存しません。',
    en: 'The choice is stored through `@k8ordo/state`’s `defineLocalState`. A visitor who never chose has no row, and the default is never stored.',
  }),
  message({
    ja: 'あとから `defaultPreference` を変えれば、選んでいない人全員の表示が変わります。タブをまたいでも、設定は 1 つにそろいます。',
    en: 'Change `defaultPreference` later, and everyone who never chose moves with it. Every tab agrees on one preference.',
  }),
] as const;

export const demoTitle = message({
  ja: 'このサイトの配色を切り替える',
  en: 'Switch this site’s colour scheme',
});

export const demoDescription = message({
  ja: 'ヘッダーの切り替えと同じ `useColorScheme()` です。',
  en: 'The same `useColorScheme()` as the switch in the header.',
});

export const demoSteps = [
  message({
    ja: '「ダーク」を押してから、ページを再読み込みします。白く光らずに、最初から暗いまま出ます。',
    en: 'Press “Dark”, then reload the page. It comes back dark from the start, with no white flash.',
  }),
  message({
    ja: '「システム」を押してから OS の外観の設定を切り替えると、ページもそれに合わせて変わります。',
    en: 'Press “System”, then change the appearance setting of your OS. The page follows it.',
  }),
  message({
    ja: 'このページを別のタブでも開いて選び直すと、こちらのタブも変わります。',
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
  ja: 'プロバイダを置き、切り替えのボタンを 1 つ作るまでの手順です。',
  en: 'Place the provider and build one switch.',
});

export const nextStyling = message({
  ja: '`dark` クラスに色を当てる方法です。`@k8ordo/ui`・Tailwind CSS・素の CSS それぞれで説明します。',
  en: 'Colouring under the `dark` class with `@k8ordo/ui`, Tailwind CSS, or plain CSS.',
});

export const nextStorage = message({
  ja: '保存する行の中身と、フックを通さずに読む方法です。',
  en: 'What the stored row holds, and reading it without the hook.',
});

export const nextCsp = message({
  ja: 'nonce とハッシュで、インラインのスクリプトを許す方法です。',
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

export const navStorage = message({
  ja: '保存',
  en: 'Storage',
});

export const navCsp = message({
  ja: 'CSP',
  en: 'CSP',
});

export const navHowItWorks = message({
  ja: '仕組み',
  en: 'How it works',
});
