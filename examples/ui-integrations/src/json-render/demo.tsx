import type { UISpec } from '@k8ordo/ui/json-render';
import { JsonRenderUI } from '@k8ordo/ui/json-render/registry';

export const jsonRenderSpec = {
  root: 'root',
  elements: {
    root: {
      type: 'Stack',
      props: { direction: 'column', gap: 'lg' },
      children: [
        'heading',
        'alert',
        'actions',
        'badges',
        'sep',
        'form',
        'card',
        'showcase',
        'overlays',
      ],
    },
    overlays: {
      type: 'Stack',
      props: { direction: 'row', gap: 'sm' },
      children: ['tip', 'dropdown', 'toast', 'modalBtn', 'popBtn'],
    },
    tip: {
      type: 'Tooltip',
      props: { triggerLabel: 'ヒント', content: 'ホバーで説明が出ます' },
      children: [],
    },
    dropdown: {
      type: 'DropdownMenu',
      props: {
        triggerLabel: 'メニュー',
        items: [{ label: '編集' }, { label: '削除' }],
      },
      children: [],
    },
    toast: {
      type: 'Toast',
      props: {
        triggerLabel: '通知を表示',
        tone: 'success',
        message: '保存しました',
      },
      children: [],
    },
    modalBtn: {
      type: 'Modal',
      props: { triggerLabel: 'モーダルを開く', title: '確認' },
      children: ['modalBody'],
    },
    modalBody: {
      type: 'Alert',
      props: { tone: 'info', message: 'モーダルの中身も生成 UI で記述' },
      children: [],
    },
    popBtn: {
      type: 'Popover',
      props: { triggerLabel: '詳細' },
      children: ['popBody'],
    },
    popBody: {
      type: 'Stack',
      props: { direction: 'column', gap: 'sm' },
      children: ['popText'],
    },
    popText: {
      type: 'Code',
      props: { code: 'ポップオーバー内のコード' },
      children: [],
    },
    showcase: {
      type: 'Card',
      props: { variant: 'outline' },
      children: ['showcaseInner'],
    },
    showcaseInner: {
      type: 'Stack',
      props: { direction: 'column', gap: 'md' },
      children: [
        'crumbs',
        'meta',
        'prog',
        'table',
        'accordion',
        'radio',
        'slider',
        'qty',
        'pager',
      ],
    },
    crumbs: {
      type: 'Breadcrumb',
      props: {
        items: [
          { label: 'Home', href: '/' },
          { label: 'Settings', href: '/settings' },
          { label: 'Profile', current: true },
        ],
      },
      children: [],
    },
    meta: {
      type: 'Stack',
      props: { direction: 'row', gap: 'sm', align: 'center' },
      children: ['ava', 'spark', 'docLink'],
    },
    ava: { type: 'Avatar', props: { name: 'Koki Sakano' }, children: [] },
    spark: { type: 'Icon', props: { name: 'sparkles' }, children: [] },
    docLink: {
      type: 'Anchor',
      props: {
        label: 'ドキュメント',
        href: 'https://example.com',
        openInNewTab: true,
      },
      children: [],
    },
    prog: {
      type: 'Progress',
      props: { value: 70, max: 100, label: '完了度' },
      children: [],
    },
    table: {
      type: 'Table',
      props: {
        caption: 'プラン比較',
        columns: [{ label: 'プラン' }, { label: '料金', align: 'right' }],
        rows: [
          ['Free', '¥0'],
          ['Pro', '¥1,000'],
        ],
      },
      children: [],
    },
    accordion: {
      type: 'Accordion',
      props: {
        items: [
          {
            title: 'よくある質問1',
            content: '回答テキスト1。',
            defaultOpen: true,
          },
          { title: 'よくある質問2', content: '回答テキスト2。' },
        ],
      },
      children: [],
    },
    radio: {
      type: 'Radio',
      props: {
        name: 'theme',
        label: 'テーマ',
        options: [
          { value: 'light', label: 'ライト' },
          { value: 'dark', label: 'ダーク' },
        ],
        defaultValue: 'dark',
      },
      children: [],
    },
    slider: {
      type: 'Slider',
      props: { name: 'volume', defaultValue: 40, min: 0, max: 100 },
      children: [],
    },
    qty: {
      type: 'NumberField',
      props: { name: 'qty', defaultValue: 3, min: 0, max: 10 },
      children: [],
    },
    pager: {
      type: 'Pagination',
      props: { name: 'page', totalPages: 5 },
      children: [],
    },
    card: {
      type: 'Card',
      props: { variant: 'outline' },
      children: ['cardInner'],
    },
    cardInner: {
      type: 'Stack',
      props: { direction: 'column', gap: 'md' },
      children: ['plan', 'tabs'],
    },
    plan: {
      type: 'Select',
      props: {
        name: 'plan',
        options: [
          { value: 'free', label: 'Free' },
          { value: 'pro', label: 'Pro' },
          { value: 'team', label: 'Team' },
        ],
        defaultValue: 'pro',
      },
      children: [],
    },
    tabs: {
      type: 'Tabs',
      props: {
        label: '詳細',
        tabs: [
          {
            label: '概要',
            content: 'json-render から Tabs を描画しています。',
          },
          { label: '料金', content: 'Pro プランは月額 1,000 円です。' },
        ],
      },
      children: [],
    },
    heading: {
      type: 'Heading',
      props: { label: 'プロフィール設定', level: 'h3' },
      children: [],
    },
    alert: {
      type: 'Alert',
      props: {
        tone: 'info',
        message: 'この画面は JSON spec から描画されています',
      },
      children: [],
    },
    actions: {
      type: 'Stack',
      props: { direction: 'row', gap: 'sm' },
      children: ['save', 'cancel', 'help'],
    },
    save: { type: 'Button', props: { label: '保存' }, children: [] },
    cancel: {
      type: 'Button',
      props: { label: 'キャンセル', variant: 'outline', color: 'secondary' },
      children: [],
    },
    help: {
      type: 'Button',
      props: {
        label: 'ヘルプ',
        variant: 'outline',
        color: 'base',
        href: 'https://example.com',
      },
      children: [],
    },
    badges: {
      type: 'Stack',
      props: { direction: 'row', gap: 'sm' },
      children: ['b-on', 'b-hold', 'b-err'],
    },
    'b-on': {
      type: 'Badge',
      props: { label: '有効', tone: 'success' },
      children: [],
    },
    'b-hold': {
      type: 'Badge',
      props: { label: '保留', tone: 'warning', variant: 'outline' },
      children: [],
    },
    'b-err': {
      type: 'Badge',
      props: { label: 'エラー', tone: 'error' },
      children: [],
    },
    sep: { type: 'Separator', props: {}, children: [] },
    form: {
      type: 'Stack',
      props: { direction: 'column', gap: 'md' },
      children: ['nickname', 'agree', 'notify'],
    },
    nickname: {
      type: 'TextField',
      props: { name: 'nickname', placeholder: 'ニックネーム' },
      children: [],
    },
    agree: {
      type: 'Checkbox',
      props: { name: 'agree', label: '規約に同意する' },
      children: [],
    },
    notify: {
      type: 'Switch',
      props: { name: 'notify', label: '通知を受け取る', defaultChecked: true },
      children: [],
    },
  },
} satisfies UISpec;

export function JsonRenderDemo() {
  return <JsonRenderUI spec={jsonRenderSpec} />;
}
