import { message } from '@k8ordo/i18n';

export const description = message({
  ja: '訪問者が選んだ配色をlocalStorageに保存し、OSの設定と合わせて`<html>`の`dark`クラスに反映するReactのダークモードです。ルートレイアウトに置く1つのプロバイダが、最初の描画の前に`dark`クラスを付けます。その後もOSの設定や保存した選択が変わると、クラスを更新します。',
  en: 'React dark mode that stores the visitor’s choice in localStorage, resolves it against the OS setting, and puts the `dark` class on `<html>`. One provider in the root layout sets the `dark` class before the first paint, then updates it when the OS setting or the saved preference changes.',
});

export const tagline = message({
  ja: 'クラスベースのReactのダークモード切り替え',
  en: 'Class-based dark mode switching for React',
});

export const claimNoFlashTitle = message({
  ja: '最初の表示から正しい配色',
  en: 'The right colors from the first paint',
});

export const claimNoFlashBody = [
  message({
    ja: 'プロバイダは、子要素より前にインラインスクリプトを出力します。このスクリプトが、保存した選択を読み、最初の描画の前に`<html>`へ`dark`クラスを付けます。',
    en: 'The provider outputs an inline script ahead of its children. The script reads the saved preference and puts the `dark` class on `<html>` before the first paint.',
  }),
  message({
    ja: '何も選んでいない訪問者には、OSの設定に合わせた配色が出ます。',
    en: 'A visitor who has not chosen gets the scheme that matches the OS setting.',
  }),
] as const;

export const claimCspTitle = message({
  ja: 'CSPで許可できるスクリプト',
  en: 'A script a CSP can allow',
});

export const claimCspBody = [
  message({
    ja: "インラインスクリプトは、プロバイダに渡す`nonce`か、スクリプトのハッシュでCSPに許可させます。`'unsafe-inline'`は要りません。",
    en: "A CSP can allow the inline script by the `nonce` you pass to the provider or by the script’s hash. No `'unsafe-inline'` is needed.",
  }),
  message({
    ja: '`colorSchemeScriptHash()`は、インストールしたバージョンのスクリプトからハッシュを計算します。ポリシーを書く場所で毎回呼べば、更新しても古い値が残りません。',
    en: '`colorSchemeScriptHash()` computes the hash from the installed version’s script. Call it where the policy is written, and an update never leaves a stale value behind.',
  }),
] as const;

export const claimStorageTitle = message({
  ja: '選んだ配色の保存',
  en: 'Saving the chosen scheme',
});

export const claimStorageBody = [
  message({
    ja: '訪問者の選択は`@k8ordo/state`の`defineLocalState`でlocalStorageに保存します。訪問者が選ぶまでは何も保存しません。',
    en: 'The choice is stored in localStorage through `@k8ordo/state`’s `defineLocalState`. Nothing is stored until the visitor chooses.',
  }),
  message({
    ja: 'あとから`defaultPreference`を変えると、まだ選んでいない訪問者全員の表示が変わります。複数のタブを開いていても、選択は1つにそろいます。',
    en: 'Change `defaultPreference` later, and every visitor who has not chosen follows it. A choice made in one tab applies to every open tab.',
  }),
] as const;

export const demoTitle = message({
  ja: '配色の切り替えのデモ',
  en: 'Scheme switch demo',
});

export const demoDescription = message({
  ja: 'ヘッダーの切り替えボタンと同じ`useColorScheme()`を使っています。',
  en: 'It uses the same `useColorScheme()` as the switch in the header.',
});

export const demoSteps = [
  message({
    ja: '「ダーク」を押してからページを再読み込みすると、最初から暗いまま表示されます。',
    en: 'Press “Dark”, then reload the page. It comes back dark from the start.',
  }),
  message({
    ja: '「システム」を押してからOSの外観の設定を切り替えると、ページの配色も変わります。',
    en: 'Press “System”, then change the appearance setting of your OS. The page follows it.',
  }),
  message({
    ja: 'このページを別のタブで開いて選び直すと、こちらのタブの配色も変わります。',
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

export const navStyling = message({
  ja: 'darkクラスのスタイル',
  en: 'Styling',
});

export const navSwitcher = message({
  ja: '切り替えボタン',
  en: 'Switch',
});

export const navStorage = message({
  ja: '設定の保存先',
  en: 'Storage',
});

export const navCsp = message({
  ja: 'CSP',
  en: 'CSP',
});

export const navTesting = message({
  ja: 'テスト',
  en: 'Testing',
});

export const navHowItWorks = message({
  ja: '仕組み',
  en: 'How it works',
});

export const navReference = message({
  ja: 'API',
  en: 'API',
});

export const navTroubleshooting = message({
  ja: 'トラブルシューティング',
  en: 'Troubleshooting',
});
