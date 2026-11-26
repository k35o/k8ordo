import type { PromptOptions } from '@openuidev/lang-core';

import { buildLibrary } from './defs';

const promptLibrary = buildLibrary({});

/** The OpenUI system prompt for `@k8ordo/ui`, without React, so a server can write it. */
export const prompt = (options?: PromptOptions): string =>
  promptLibrary.prompt(options);
