import { message } from '@k8ordo/i18n';

export const tagline = message({
  ja: 'ボタンもダイアログもServer Componentに置けるReactのコンポーネント集',
  en: 'React components, buttons and dialogs included, that you can place in a Server Component',
});

export const claimPlatformTitle = message({
  ja: '最前面に開くメニューとツールチップ',
  en: 'Menus and tooltips in the top layer',
});

export const claimPlatformBody = [
  message({
    ja: 'メニューやツールチップはPopover APIで最前面に開き、位置はCSS Anchor Positioningで指定します。`z-index`を調整する必要はありません。',
    en: 'Menus and tooltips open in the top layer through the Popover API, and CSS Anchor Positioning places them. There is no `z-index` to tune.',
  }),
  message({
    ja: '使うのはBaselineに入ったブラウザの機能だけです。polyfillも、古いブラウザのための分岐もありません。',
    en: 'Only browser features at Baseline are used. There is no polyfill and no branch for old browsers.',
  }),
] as const;

export const demoOverlayTitle = message({
  ja: 'メニューとツールチップのデモ',
  en: 'Menu and tooltip demo',
});

export const demoOverlayDescription = message({
  ja: 'どちらも`@k8ordo/ui`のコンポーネントをそのまま置いています。',
  en: 'Both are `@k8ordo/ui` components, used unchanged.',
});

export const demoOverlaySteps = [
  message({
    ja: '「操作」を押してメニューを開きます。矢印キーで項目を移動し、Escキーで閉じます。',
    en: 'Press “Actions” to open the menu. Move through it with the arrow keys, then close it with Esc.',
  }),
  message({
    ja: '封筒のボタンにポインタを合わせるか、Tabキーでフォーカスを移します。ボタンの名前がツールチップで表示されます。',
    en: 'Hover the envelope button, or Tab to it. Its name shows in a tooltip.',
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
  ja: '縦書きでも同じコンポーネント',
  en: 'Same components in vertical writing',
});

export const claimVerticalBody = [
  message({
    ja: '`writing-v`を付けた要素の中では、コンポーネントも縦書きで表示されます。propsを渡す必要はありません。',
    en: 'Inside an element with `writing-v`, the components render vertically on their own. There are no props to pass.',
  }),
  message({
    ja: '日本語を縦書きで組むページのために、ボタンやカードを別に用意する必要はありません。',
    en: 'A page that sets Japanese vertically needs no separate buttons or cards.',
  }),
] as const;

export const demoVerticalTitle = message({
  ja: '縦書きのデモ',
  en: 'Vertical writing demo',
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
  ja: 'エージェント用の文書と生成UIのカタログ',
  en: 'Docs for agents, a catalog for generative UI',
});

export const claimAgentsBody = [
  message({
    ja: '設計の指針とリファレンスはnpmパッケージに同梱しています。エージェントは`node_modules/@k8ordo/ui/docs/`から、インストールしたバージョンのドキュメントを読めます。',
    en: 'The design guide and the references ship inside the npm package. An agent reads the installed version from `node_modules/@k8ordo/ui/docs/`.',
  }),
  message({
    ja: 'LLMに画面を組み立てさせるときは、json-renderかOpenUIのカタログを使います。カタログはコンポーネントのpropsの型と照合しているので、実装と食い違いません。',
    en: 'To let an LLM compose a screen, use the json-render or OpenUI catalog. The catalog is checked against the components’ prop types, so it cannot drift from the implementation.',
  }),
] as const;
