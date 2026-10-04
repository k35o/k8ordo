import { message } from '@k8ordo/i18n';

export const tagline = message({
  ja: '触れるものは柔らかく、読むものは端正に。React Server Componentsで使えるコンポーネント集。',
  en: 'Soft where you touch, precise where you read: React components that work in Server Components.',
});

export const claimPlatformTitle = message({
  ja: 'メニューもツールチップも、ブラウザの最前面に開く',
  en: 'Menus and tooltips open in the browser’s top layer',
});

export const claimPlatformBody = [
  message({
    ja: 'ポップオーバーはPopover APIで最前面の層に開き、表示する位置はCSS Anchor Positioningで決めます。z-indexを調整する必要はありません。',
    en: 'Overlays open in the top layer through the Popover API and are placed with CSS Anchor Positioning. There is no z-index to tune.',
  }),
  message({
    ja: '使うのは、Baselineに入ったブラウザの機能だけです。ポリフィルも、古いブラウザのための分岐も入っていません。',
    en: 'Only browser features that have reached Baseline are used. Nothing ships for polyfills or old browsers.',
  }),
] as const;

export const demoOverlayTitle = message({
  ja: 'メニューとツールチップを開く',
  en: 'Open a menu and a tooltip',
});

export const demoOverlayDescription = message({
  ja: 'どちらも`@k8ordo/ui`のコンポーネントをそのまま置いています。',
  en: 'Both are `@k8ordo/ui` components, placed as they are.',
});

export const demoOverlaySteps = [
  message({
    ja: '「操作」を押してメニューを開き、矢印キーで項目を移動してから、Escキーで閉じてみてください。',
    en: 'Press “Actions” to open the menu, move through it with the arrow keys, then close it with Esc.',
  }),
  message({
    ja: '封筒のボタンにマウスを載せるか、Tabキーでフォーカスを移すと、ボタンの名前がツールチップで表示されます。',
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
  ja: '縦書きのページにも、同じコンポーネントを置ける',
  en: 'The same components work on a vertical page',
});

export const claimVerticalBody = [
  message({
    ja: '余白や角丸は、上下左右ではなく、文字の流れに沿った論理プロパティで書いています。そのため`writing-v`で縦書きにすると、コンポーネントもその向きに組み替わります。',
    en: 'Spacing and corners are written with logical properties that follow the text, not top and left. Switch to vertical writing with `writing-v`, and the components turn with it.',
  }),
  message({
    ja: '日本語を縦書きで組むページのために、ボタンやカードを別に用意する必要はありません。',
    en: 'A page that sets Japanese vertically needs no separate buttons or cards.',
  }),
] as const;

export const demoVerticalTitle = message({
  ja: '縦書きに切り替える',
  en: 'Switch to vertical writing',
});

export const demoVerticalDescription = message({
  ja: 'スイッチで、下のカードの`writing-mode`を切り替えます。',
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
  ja: '同じコンポーネントが、文字の向きに合わせて組み替わります。',
  en: 'The same components follow the direction of the text.',
});

export const demoButton = message({
  ja: '詳しく読む',
  en: 'Read more',
});

export const claimAgentsTitle = message({
  ja: 'エージェントが読めるドキュメントと、生成UIのカタログ',
  en: 'Docs an agent can read, and a catalog for generative UI',
});

export const claimAgentsBody = [
  message({
    ja: '設計の指針とリファレンスは、npmパッケージに同梱しています。エージェントは`node_modules/@k8ordo/ui/docs/`から、インストールした版のドキュメントをそのまま読めます。',
    en: 'The design guide and references ship inside the npm package, so an agent reads the exact installed version from `node_modules/@k8ordo/ui/docs/`.',
  }),
  message({
    ja: 'LLMに画面を組み立てさせるときは、json-renderかOpenUIのカタログを使います。カタログはコンポーネントのpropsと型で照らし合わせているので、両者が食い違うことはありません。',
    en: 'To let an LLM compose a screen, use the json-render or OpenUI catalog. It is type-checked against the components’ own props, so the two never drift.',
  }),
] as const;

export const nextGetStarted = message({
  ja: 'スタイルシートを読み込み、最初のコンポーネントを置くところまでです。',
  en: 'Load the stylesheet and place your first component.',
});

export const nextComponents = message({
  ja: 'すべてのコンポーネントを、動く例とpropsの表で紹介しています。',
  en: 'Every component, with live examples and its props.',
});

export const nextTheming = message({
  ja: '色や余白、文字のデザイントークンと、ダークモードです。',
  en: 'Colour, spacing and type tokens, and dark mode.',
});

export const nextI18n = message({
  ja: 'コンポーネントが自分で描く文言と、その言語の決まり方です。',
  en: 'The wording components draw themselves, and how its language is chosen.',
});

export const nextAi = message({
  ja: 'チャット画面のコンポーネントと、生成UIのカタログです。',
  en: 'Chat components, and the catalogs for generative UI.',
});
