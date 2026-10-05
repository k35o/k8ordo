import { message } from '@k8ordo/i18n';

export const tagline = message({
  ja: '触れるものは柔らかく、読むものは端正に。React Server Components で使える部品集。',
  en: 'Soft where you touch, precise where you read: React components that work in Server Components.',
});

export const claimPlatformTitle = message({
  ja: 'メニューもツールチップも、ブラウザの最前面に開く',
  en: 'Menus and tooltips open in the browser’s top layer',
});

export const claimPlatformBody = [
  message({
    ja: 'ポップオーバーは Popover API で最前面の層に開き、位置は CSS Anchor Positioning で決めます。z-index を調整する必要はありません。',
    en: 'Overlays open in the top layer through the Popover API and are placed with CSS Anchor Positioning. There is no z-index to tune.',
  }),
  message({
    ja: '使うのは Baseline に入ったブラウザの機能だけです。ポリフィルも、古いブラウザ向けの分岐も入っていません。',
    en: 'Only browser features that have reached Baseline are used. Nothing ships for polyfills or old browsers.',
  }),
] as const;

export const demoOverlayTitle = message({
  ja: 'メニューとツールチップを開く',
  en: 'Open a menu and a tooltip',
});

export const demoOverlayDescription = message({
  ja: 'どちらも `@k8ordo/ui` の部品をそのまま置いたものです。',
  en: 'Both are `@k8ordo/ui` components, placed as they are.',
});

export const demoOverlaySteps = [
  message({
    ja: '「操作」を押してメニューを開き、矢印キーで項目を移ってから Esc で閉じます。',
    en: 'Press “Actions” to open the menu, move through it with the arrow keys, then close it with Esc.',
  }),
  message({
    ja: '封筒のボタンにマウスを載せるか、Tab でフォーカスを移すと、名前がツールチップで出ます。',
    en: 'Hover the envelope button, or Tab to it, and its name shows in a tooltip.',
  }),
] as const;

export const demoMenu = message({
  ja: '操作',
  en: 'Actions',
});

export const demoRename = message({
  ja: '名前を変える',
  en: 'Rename',
});

export const demoDuplicate = message({
  ja: '複製する',
  en: 'Duplicate',
});

export const demoArchive = message({
  ja: 'アーカイブする',
  en: 'Archive',
});

export const demoShare = message({
  ja: 'メールで共有',
  en: 'Share by email',
});

export const demoLast = message({
  ja: '最後に選んだ操作',
  en: 'Last action',
});

export const claimVerticalTitle = message({
  ja: '縦書きの紙面にも、同じ部品を置ける',
  en: 'The same components work on a vertical page',
});

export const claimVerticalBody = [
  message({
    ja: '余白や角丸は、上下左右ではなく文の流れに沿った論理プロパティで書いています。`writing-v` で縦書きにすると、部品もその向きに組み替わります。',
    en: 'Spacing and corners are written with logical properties that follow the text, not top and left. Switch to vertical writing with `writing-v`, and the components turn with it.',
  }),
  message({
    ja: '日本語を縦に組むページのために、ボタンやカードを別に作る必要はありません。',
    en: 'A page that sets Japanese vertically needs no separate buttons or cards.',
  }),
] as const;

export const demoVerticalTitle = message({
  ja: '縦書きに切り替える',
  en: 'Switch to vertical writing',
});

export const demoVerticalDescription = message({
  ja: 'スイッチで、下のカードの `writing-mode` を切り替えます。',
  en: 'The switch toggles the `writing-mode` of the card below.',
});

export const demoVertical = message({
  ja: '縦書き',
  en: 'Vertical',
});

export const demoBadge = message({
  ja: 'お知らせ',
  en: 'Notice',
});

export const demoHeading = message({
  ja: '縦書きの紙面',
  en: 'A vertical page',
});

export const demoBody = message({
  ja: '同じ部品が、文の向きに合わせて組み替わります。',
  en: 'The same components follow the direction of the text.',
});

export const demoButton = message({
  ja: '詳しく読む',
  en: 'Read more',
});

export const claimAgentsTitle = message({
  ja: 'エージェントが読める文書と、生成 UI のカタログ',
  en: 'Docs an agent can read, and a catalog for generative UI',
});

export const claimAgentsBody = [
  message({
    ja: '設計の指針とリファレンスは npm パッケージに入っています。エージェントは `node_modules/@k8ordo/ui/docs/` から、入れた版そのものを読みます。',
    en: 'The design guide and references ship inside the npm package, so an agent reads the exact installed version from `node_modules/@k8ordo/ui/docs/`.',
  }),
  message({
    ja: 'LLM に画面を組ませるときは、json-render か OpenUI のカタログを使います。カタログは部品の props と型で突き合わせてあるので、部品と食い違いません。',
    en: 'To let an LLM compose a screen, use the json-render or OpenUI catalog. It is type-checked against the components’ own props, so the two never drift.',
  }),
] as const;

export const nextGetStarted = message({
  ja: 'スタイルシートを読み込み、最初の部品を置くまでです。',
  en: 'Load the stylesheet and place your first component.',
});

export const nextComponents = message({
  ja: 'すべての部品を、動く例と props の表で見られます。',
  en: 'Every component, with live examples and its props.',
});

export const nextTheming = message({
  ja: '色・余白・文字のトークンと、ダークモードです。',
  en: 'Colour, spacing and type tokens, and dark mode.',
});

export const nextI18n = message({
  ja: '部品が自分で描く文言と、その言語の決まり方です。',
  en: 'The wording components draw themselves, and how its language is chosen.',
});

export const nextAi = message({
  ja: 'チャットの部品と、生成 UI のカタログです。',
  en: 'Chat components, and the catalogs for generative UI.',
});
