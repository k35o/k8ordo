'use client';

import { Button, ChevronIcon, Code } from '@k8ordo/ui';
import { Message } from '@k8ordo/ui/ai';
import type { ReactNode } from 'react';

import styles from './ai-previews.module.css';

export const aiPreviews: Record<string, ReactNode> = {
  'AI Chat': (
    <div className={styles.chat}>
      <Message.Root from="user">
        <Message.Content>縦書き対応はある？</Message.Content>
      </Message.Root>
      <Message.Root from="assistant">
        <Message.Content>はい、writing-v で切り替えられます。</Message.Content>
      </Message.Root>
    </div>
  ),
  'Generative UI': (
    <div className={styles.generative}>
      <Code>{`{ type: 'Button' }`}</Code>
      <span aria-hidden className={styles.arrow}>
        <ChevronIcon direction="right" size="sm" />
      </span>
      <Button size="sm" variant="solid">
        OK
      </Button>
    </div>
  ),
  'AI Agents': (
    <div className={styles.agents}>
      <Code>docs/GUIDE.md</Code>
      <Code>docs/references/*.md</Code>
      <Code>llms.txt</Code>
    </div>
  ),
};
