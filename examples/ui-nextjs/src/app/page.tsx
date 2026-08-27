import { catalog } from '@k8ordo/ui/json-render';
import type { ArteSpec } from '@k8ordo/ui/json-render';

import { GenUiClient } from './gen-ui-client';

const spec = {
  root: 'root',
  elements: {
    root: {
      type: 'Stack',
      props: { direction: 'column', gap: 'lg' },
      children: ['heading', 'alert', 'actions', 'form'],
    },
    heading: {
      type: 'Heading',
      props: { label: 'RSC から描画', level: 'h3' },
      children: [],
    },
    alert: {
      type: 'Alert',
      props: {
        tone: 'success',
        message: 'registry はクライアント、catalog はサーバーで動いています',
      },
      children: [],
    },
    actions: {
      type: 'Stack',
      props: { direction: 'row', gap: 'sm' },
      children: ['save', 'help'],
    },
    save: { type: 'Button', props: { label: '保存' }, children: [] },
    help: {
      type: 'Button',
      props: {
        label: 'ヘルプ',
        variant: 'outline',
        href: 'https://example.com',
      },
      children: [],
    },
    form: {
      type: 'Stack',
      props: { direction: 'column', gap: 'md' },
      children: ['nickname', 'notify'],
    },
    nickname: {
      type: 'TextField',
      props: { name: 'nickname', placeholder: 'ニックネーム' },
      children: [],
    },
    notify: {
      type: 'Switch',
      props: { name: 'notify', label: '通知を受け取る', defaultChecked: true },
      children: [],
    },
  },
} satisfies ArteSpec;

export default function Home() {
  const systemPrompt = catalog.prompt();
  const promptChars = systemPrompt.length;

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col gap-6 p-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">k8ordo UI × json-render（RSC）</h1>
        <p className="text-fg-mute text-sm" data-testid="server-prompt-info">
          サーバーで catalog.prompt() を生成（{promptChars} 文字）。下の UI は
          クライアントの registry で描画。
        </p>
      </div>
      <GenUiClient spec={spec} />
    </div>
  );
}
