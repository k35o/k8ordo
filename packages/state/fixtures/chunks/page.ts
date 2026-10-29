import { definePageState, useAppState } from '@k8ordo/state';
import * as z from 'zod/mini';

const pageState = definePageState('page', {
  url: z.object({ q: z._default(z.string(), '') }),
});

export const usePage = (): unknown => useAppState(pageState);
