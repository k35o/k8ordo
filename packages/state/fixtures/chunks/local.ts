import { defineLocalState, useAppState } from '@k8ordo/state';
import * as z from 'zod/mini';

const localState = defineLocalState('local', z.object({ on: z.boolean() }));

export const useLocal = (): unknown => useAppState(localState);
