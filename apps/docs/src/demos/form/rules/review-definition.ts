import { defineForm, minChecked, requiredWhen } from '@k8ordo/form/server';
import * as z from 'zod/mini';

import * as m from '../../../messages';

const ASPECTS = ['content', 'structure', 'timing'] as const;

// ディレクティブ無し: ページ（Server Component）だけが読む。文言は関数のまま
// 渡すので、描画の中で formFields が呼んだときのロケールで引かれる。
export const reviewDefinition = defineForm(
  z.object({
    decision: z.enum(['accept', 'reject'], {
      error: m.formRules.demoDecisionMissing,
    }),
    reason: z.string(),
    aspects: z.array(z.enum(ASPECTS)),
  }),
  [
    requiredWhen(
      'reason',
      'decision',
      'reject',
      m.formRules.demoReasonRequired,
    ),
    minChecked('aspects', 2, m.formRules.demoAspectsMin),
  ],
);
