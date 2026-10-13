import { definePageState } from '@k8ordo/state';
import * as z from 'zod/mini';

export const demoState = definePageState('state-demo', {
  url: z.object({
    tab: z._default(z.enum(['overview', 'details', 'reviews']), 'overview'),
    page: z._default(z.coerce.number().check(z.int(), z.gte(1)), 1),
  }),
});

export const TABS = ['overview', 'details', 'reviews'] as const;
