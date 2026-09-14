import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'k8ordo UIは、React 19で構築されたUIコンポーネントライブラリです。フォームやカードなどユーザーが操作する要素は丸みと余白で親しみやすく、情報を伝える要素はシャープさを保って明確に。穏やかだけど退屈じゃないUIを実現します。',
  en: 'k8ordo UI is a UI component library built with React 19. Interactive elements like forms and cards feel approachable with rounded shapes and generous spacing, while informational elements stay crisp and clear. Calm but never boring UI.',
});

export const installationTitle = message({
  ja: 'インストール',
  en: 'Installation',
});

export const installationDescription = message({
  ja: 'お好みのパッケージマネージャーでインストールしてください。',
  en: 'Install with your preferred package manager.',
});

export const setupTitle = message({
  ja: 'セットアップ',
  en: 'Setup',
});

export const setupDescription = message({
  ja: 'インストール後、以下の2つの設定を行ってください。',
  en: 'After installation, complete the following two configuration steps.',
});

export const setupCssDescription = message({
  ja: 'ビルド済みCSSをアプリケーションのエントリーポイントでインポートしてください。Tailwind CSSのセットアップは不要です。',
  en: 'Import the prebuilt CSS at your application entry point. No Tailwind CSS setup is required.',
});

export const setupCssTailwindDescription = message({
  ja: 'Tailwind CSS 4を使うプロジェクトは、代わりにソース版をインポートすると、デザイントークンを自分のマークアップのTailwindクラスとしても使えます。',
  en: 'Projects using Tailwind CSS 4 can import the source entry instead, which also makes the design tokens available as Tailwind classes in your own markup.',
});

export const setupProviderDescription = message({
  ja: 'UIProviderでアプリケーションをラップしてください。',
  en: 'Wrap your application with UIProvider.',
});

export const usageTitle = message({
  ja: '使い方',
  en: 'Usage',
});

export const usageDescription = message({
  ja: 'セットアップが完了したら、コンポーネントをインポートして使用できます。',
  en: 'Once setup is complete, you can import and use components.',
});

export const requirementsTitle = message({
  ja: '動作要件',
  en: 'Requirements',
});

export const requirementsDescription = message({
  ja: 'k8ordo UIを使用するには、以下のピア依存関係が必要です。',
  en: 'k8ordo UI requires the following peer dependencies.',
});

export const nextStepsTitle = message({
  ja: '次のステップ',
  en: 'Next Steps',
});

export const nextStepsComponents = message({
  ja: 'コンポーネント一覧を確認して、使用できるUIパーツを探す',
  en: 'Browse the component catalog to discover available UI parts',
});

export const nextStepsTheming = message({
  ja: 'テーマのカスタマイズ方法を学ぶ',
  en: 'Learn how to customize the theme',
});

export const nextStepsI18n = message({
  ja: '組み込み文言を英語にする・差し替える',
  en: 'Switch the built-in wording to English or replace it',
});

export const nextStepsStorybook = message({
  ja: 'Storybookで各コンポーネントの詳細なドキュメントを確認する',
  en: 'View detailed documentation for each component in Storybook',
});

export const packageManagerLabel = message({
  ja: 'パッケージマネージャー',
  en: 'Package manager',
});
