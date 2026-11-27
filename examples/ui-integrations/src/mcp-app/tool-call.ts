import type { CallToolResult } from '@modelcontextprotocol/client';
import type { App } from '@modelcontextprotocol/ext-apps';

import { screenInput } from '../a2ui/screen.ts';
import type { ScreenInput } from '../a2ui/screen.ts';

export type ToolCallSnapshot = {
  input: ScreenInput | null;
  result: CallToolResult | null;
};

export type ToolCall = {
  subscribe: (onChange: () => void) => () => void;
  getSnapshot: () => ToolCallSnapshot;
};

/**
 * Holds the `show_ui` call the host hands the App. Call it before
 * `app.connect()`: the host sends the call once, right after the handshake.
 */
export const watchToolCall = (app: App): ToolCall => {
  let snapshot: ToolCallSnapshot = { input: null, result: null };
  const listeners = new Set<() => void>();
  const update = (next: Partial<ToolCallSnapshot>) => {
    snapshot = { ...snapshot, ...next };
    for (const listener of listeners) {
      listener();
    }
  };

  app.addEventListener('toolinput', ({ arguments: args }) => {
    const parsed = screenInput.safeParse(args);
    update({ input: parsed.success ? parsed.data : null });
  });
  app.addEventListener('toolresult', (result) => {
    update({ result });
  });

  return {
    subscribe: (onChange) => {
      listeners.add(onChange);
      return () => {
        listeners.delete(onChange);
      };
    },
    getSnapshot: () => snapshot,
  };
};
