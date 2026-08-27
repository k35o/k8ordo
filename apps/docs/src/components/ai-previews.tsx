'use client';

import { Button, ChevronIcon, Code } from '@k8ordo/ui';
import { Message } from '@k8ordo/ui/ai';
import type { ReactNode } from 'react';

export const aiPreviews: Record<string, ReactNode> = {
  'AI Chat': (
    <div className="flex w-full flex-col gap-2">
      <Message.Root from="user">
        <Message.Content>縦書き対応はある？</Message.Content>
      </Message.Root>
      <Message.Root from="assistant">
        <Message.Content>はい、writing-v で切り替えられます。</Message.Content>
      </Message.Root>
    </div>
  ),
  'Generative UI': (
    <div className="flex w-full items-center justify-center gap-3">
      <Code>{`{ type: 'Button' }`}</Code>
      <span aria-hidden className="text-fg-subtle">
        <ChevronIcon direction="right" size="sm" />
      </span>
      <Button size="sm" variant="solid">
        OK
      </Button>
    </div>
  ),
  'AI Agents': (
    <div className="flex flex-col items-start gap-1.5">
      <Code>docs/GUIDE.md</Code>
      <Code>docs/references/*.md</Code>
      <Code>llms.txt</Code>
    </div>
  ),
};
