import { message } from '@k8ordo/i18n';

export const description = message({
  ja: '穏やかだけど退屈じゃないUIを作るためのReactコンポーネントライブラリ',
  en: 'A React component library for UI that is calm but never boring',
});

export const getStarted = message({
  ja: 'はじめる',
  en: 'Get Started',
});

export const viewComponents = message({
  ja: 'コンポーネントを見る',
  en: 'Browse Components',
});

export const featuresTitle = message({
  ja: '特徴',
  en: 'Features',
});

export const featureReact = message({
  ja: 'React 19',
  en: 'React 19',
});

export const featureReactDescription = message({
  ja: 'Server Componentsからそのまま使える。クライアントに送る必要のないものは、サーバーで描いたまま置いておける。',
  en: 'Usable straight from Server Components — anything that does not need the client stays rendered on the server.',
});

export const featureTokens = message({
  ja: 'デザイントークン',
  en: 'Design Tokens',
});

export const featureTokensDescription = message({
  ja: 'ビルド済みCSSのインポート1行で動き、Tailwind CSSのセットアップは不要。色や余白はセマンティックトークンで統一され、ライトモードとダークモードもシームレスに切り替わります。',
  en: 'One prebuilt CSS import and it just works — no Tailwind CSS setup required. Semantic tokens keep colors and spacing consistent, and light and dark modes switch seamlessly.',
});

export const featureTypeScript = message({
  ja: 'TypeScript',
  en: 'TypeScript',
});

export const featureTypeScriptDescription = message({
  ja: 'propsのリファレンスは型から生成されるので、ドキュメントが実装からずれない。存在しないpropsを書けば、動かす前にエディタが教えてくれる。',
  en: 'The props reference is generated from the types, so the docs cannot drift from the implementation. Write a prop that does not exist and the editor tells you before you ever run it.',
});

export const featureAgents = message({
  ja: 'エージェント向けの面',
  en: 'A surface for agents',
});

export const featureAgentsDescription = message({
  ja: '設計ガイドとリファレンスがnpmパッケージに同梱される。AIは`node_modules/@k8ordo/ui/docs/`からインストールした版そのものを読む。StorybookのMCPエンドポイントから実物のpropsも引ける。',
  en: 'The design guide and reference ship inside the npm package, so an agent reads the exact version you installed from `node_modules/@k8ordo/ui/docs/`. Real props can also be queried through Storybook\u2019s MCP endpoint.',
});

export const featureAccessible = message({
  ja: 'アクセシビリティ',
  en: 'Accessibility',
});

export const featureAccessibleDescription = message({
  ja: 'WAI-ARIAパターンに基づき、キーボード操作やスクリーンリーダーに配慮したコンポーネントを目指しています。',
  en: 'Aiming for components that consider keyboard navigation and screen reader support based on WAI-ARIA patterns.',
});

export const featureMinimal = message({
  ja: '柔と端のデザイン',
  en: 'Soft & Sharp Design',
});

export const featureMinimalDescription = message({
  ja: '触れるものは柔らかく、読むものは端正に。余白と形の柔らかさで魅せるUIを提供します。',
  en: 'Soft where you touch, sharp where you read. UI that speaks through whitespace and gentle forms.',
});

export const featureVerticalWriting = message({
  ja: '縦書き対応',
  en: 'Vertical Writing Support',
});

export const featureVerticalWritingDescription = message({
  ja: '`writing-v`ユーティリティでwriting-modeを切り替えると、コンポーネントは縦書きの紙面でも崩れずに追従します。日本語ドキュメントを縦書きで体験できます。',
  en: 'Switch writing-mode with the `writing-v` utility and every component follows along on a vertical page. Preview the Japanese docs in vertical mode.',
});
