import { MessageProcessor } from '@a2ui/web_core';
import { Alert, IconButton, Stack } from '@k8ordo/ui';
import { MaximizeIcon, MinimizeIcon } from '@k8ordo/ui/icons';
import type { CallToolResult } from '@modelcontextprotocol/client';
import type { App } from '@modelcontextprotocol/ext-apps';
import { useCallback, useEffect, useMemo, useSyncExternalStore } from 'react';

import { A2uiSurfaces, a2uiCatalog } from '../a2ui/renderer';
import { messagesOf, reportOf, stateOf } from '../mcp/show-ui.ts';
import type { ShowUiInput } from '../mcp/show-ui.ts';
import type { ToolCall } from './tool-call';

const processorOf = (input: ShowUiInput): MessageProcessor => {
  const processor = new MessageProcessor([a2uiCatalog]);
  for (const message of messagesOf(input)) {
    processor.processMessagesWithErrors(message);
  }
  return processor;
};

const dataModelOf = (processor: MessageProcessor): unknown =>
  processor.model.surfacesMap.get('main')?.dataModel.get('/') ?? {};

const textOf = (content: CallToolResult['content']): string =>
  content
    .flatMap((block) => (block.type === 'text' ? [block.text] : []))
    .join('\n');

export function McpAppView({
  app,
  toolCall,
}: {
  app: App;
  toolCall: ToolCall;
}) {
  const { input, result } = useSyncExternalStore(
    toolCall.subscribe,
    toolCall.getSnapshot,
  );
  const subscribeHostContext = useCallback(
    (onChange: () => void) => {
      app.addEventListener('hostcontextchanged', onChange);
      return () => {
        app.removeEventListener('hostcontextchanged', onChange);
      };
    },
    [app],
  );
  const hostContext = useSyncExternalStore(subscribeHostContext, () =>
    app.getHostContext(),
  );
  const processor = useMemo(
    () => (input === null ? null : processorOf(input)),
    [input],
  );

  const isDark = hostContext?.theme === 'dark';
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  useEffect(() => {
    if (processor === null) {
      return;
    }
    const actions = processor.model.onAction.subscribe((payload) => {
      void app.sendMessage({
        role: 'user',
        content: [
          {
            type: 'text',
            text: reportOf(
              {
                name: payload.name,
                sourceComponentId: payload.sourceComponentId,
                context: payload.context,
              },
              dataModelOf(processor),
            ),
          },
        ],
      });
    });
    const changes = processor.model.surfacesMap
      .get('main')
      ?.dataModel.subscribe('/', () => {
        void app.updateModelContext({
          content: [{ type: 'text', text: stateOf(dataModelOf(processor)) }],
        });
      });
    return () => {
      actions.unsubscribe();
      changes?.unsubscribe();
    };
  }, [app, processor]);

  const canFullscreen =
    hostContext?.availableDisplayModes?.includes('fullscreen') ?? false;
  const isFullscreen = hostContext?.displayMode === 'fullscreen';

  return (
    <Stack gap="sm" padding="md">
      {canFullscreen && (
        <Stack direction="row" justify="end">
          <IconButton
            label={isFullscreen ? 'チャットの中に戻す' : '全画面で開く'}
            onAction={async () => {
              await app.requestDisplayMode({
                mode: isFullscreen ? 'inline' : 'fullscreen',
              });
            }}
          >
            {isFullscreen ? <MinimizeIcon /> : <MaximizeIcon />}
          </IconButton>
        </Stack>
      )}
      {result?.isError === true && (
        <Alert message={textOf(result.content)} tone="error" />
      )}
      {processor !== null && <A2uiSurfaces processor={processor} />}
    </Stack>
  );
}
