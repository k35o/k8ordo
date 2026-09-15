import { defineLocalState } from '@k8ordo/state';
import * as z from 'zod/mini';

// 定義はディレクティブ無しのモジュールに置く。`'use client'` のファイルから
// export すると Server Component 側には client reference の代理しか届かない。
// カラースキームはここには無い: @k8ordo/color-scheme が持つ。

export const WRITING_MODES = ['horizontal', 'vertical'] as const;

export type WritingMode = (typeof WRITING_MODES)[number];

// 未設定と未知の値はどちらも横書き（既定）に落ちる。
export const writingModeState = defineLocalState(
  'writing-mode',
  z.object({ mode: z.optional(z.enum(WRITING_MODES)) }),
);
