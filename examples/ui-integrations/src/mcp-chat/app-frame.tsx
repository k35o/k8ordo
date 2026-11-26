import { MCPAppRenderer } from '@ai-sdk/react';
import type {
  MCPAppBridgeHandlers,
  MCPAppMetadata,
  MCPAppResource,
} from '@ai-sdk/react';
import type { DynamicToolUIPart, ToolUIPart } from 'ai';
import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';

type DisplayMode = 'inline' | 'fullscreen';

const HOST_INFO = { name: 'k8ordo-ui-integrations', version: '1.0.0' };
const DISPLAY_MODES: DisplayMode[] = ['inline', 'fullscreen'];

export const loadResource = async ({
  resourceUri,
}: MCPAppMetadata): Promise<MCPAppResource> => {
  const response = await fetch('/api/mcp-app/resource', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ uri: resourceUri }),
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return (await response.json()) as MCPAppResource;
};

const textOf = (params: unknown): string => {
  const { content, structuredContent } = (params ?? {}) as {
    content?: Array<{ type: string; text?: string }>;
    structuredContent?: unknown;
  };
  const texts = (content ?? []).flatMap((block) =>
    block.type === 'text' && block.text !== undefined ? [block.text] : [],
  );
  return structuredContent === undefined
    ? texts.join('\n')
    : [...texts, JSON.stringify(structuredContent)].join('\n');
};

/**
 * Draws the MCP App of a tool part inside the chat, in the sandbox at
 * `sandboxUrl` (a page on another origin). What the App sends to the
 * conversation goes to `onMessage`, and what it puts in the model's context
 * to `onModelContext`; it may return `false` to refuse the message. A tool
 * part without an App is drawn as `fallback`.
 */
export function McpAppFrame({
  part,
  sandboxUrl,
  theme,
  onMessage,
  onModelContext,
  fallback,
}: {
  part: ToolUIPart | DynamicToolUIPart;
  sandboxUrl: string;
  theme: 'light' | 'dark';
  onMessage: (text: string) => boolean;
  onModelContext: (text: string) => void;
  fallback: ReactNode;
}) {
  const [height, setHeight] = useState<number | null>(null);
  const [mode, setMode] = useState<DisplayMode>('inline');
  const hostContext = useMemo(
    () => ({
      theme,
      displayMode: mode,
      availableDisplayModes: DISPLAY_MODES,
    }),
    [theme, mode],
  );
  const handlers = useMemo<MCPAppBridgeHandlers>(
    () => ({
      sendMessage: (params) =>
        onMessage(textOf(params)) ? {} : { isError: true },
      updateModelContext: (params) => {
        onModelContext(textOf(params));
        return {};
      },
      requestDisplayMode: ({ mode: requested }) => {
        const next = requested === 'fullscreen' ? 'fullscreen' : 'inline';
        setMode(next);
        return { mode: next };
      },
      onSizeChange: ({ height: next }) => {
        if (next !== undefined) {
          setHeight(next);
        }
      },
    }),
    [onMessage, onModelContext],
  );
  const isFullscreen = mode === 'fullscreen';

  return (
    <div
      className={
        isFullscreen
          ? 'bg-bg-base z-modal fixed inset-0'
          : 'border-border-mute w-full overflow-hidden rounded-xl border'
      }
    >
      <MCPAppRenderer
        fallback={fallback}
        handlers={handlers}
        hostContext={hostContext}
        hostInfo={HOST_INFO}
        loadResource={loadResource}
        part={part}
        sandbox={{
          url: sandboxUrl,
          title: '生成した画面',
          style: {
            display: 'block',
            width: '100%',
            height: isFullscreen ? '100%' : `${String(height ?? 160)}px`,
            border: 0,
          },
        }}
      />
    </div>
  );
}
