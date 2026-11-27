import {
  RESOURCE_MIME_TYPE,
  registerAppResource,
  registerAppTool,
} from '@modelcontextprotocol/ext-apps/server';
import { McpServer } from '@modelcontextprotocol/server';

import { screenInput } from '../a2ui/screen.ts';
import { APP_URI, issuesOf, SHOW_UI, showUiDescription } from './show-ui.ts';

/**
 * The MCP server with the `show_ui` tool and the App that draws its screens.
 * `readAppHtml` gives the App as one HTML file (`pnpm build:mcp-app`).
 */
export const createMcpServer = ({
  readAppHtml,
}: {
  readAppHtml: () => Promise<string>;
}): McpServer => {
  const server = new McpServer({ name: 'k8ordo-ui', version: '1.0.0' });

  registerAppTool(
    server,
    SHOW_UI,
    {
      title: 'Show a screen',
      description: showUiDescription,
      inputSchema: screenInput,
      _meta: { ui: { resourceUri: APP_URI } },
    },
    (input) => {
      const issues = issuesOf(input);
      return issues.length === 0
        ? {
            content: [
              {
                type: 'text',
                text: 'The screen is shown to the user. What they do on it arrives as a user message.',
              },
            ],
          }
        : {
            isError: true,
            content: [
              {
                type: 'text',
                text: [
                  'The screen breaks the A2UI catalog. Fix these and call show_ui again:',
                  ...issues,
                ].join('\n'),
              },
            ],
          };
    },
  );

  registerAppResource(
    server,
    'k8ordo screen',
    APP_URI,
    {
      mimeType: RESOURCE_MIME_TYPE,
      description: 'Draws a show_ui screen with @k8ordo/ui.',
    },
    async () => ({
      contents: [
        {
          uri: APP_URI,
          mimeType: RESOURCE_MIME_TYPE,
          text: await readAppHtml(),
        },
      ],
    }),
  );

  return server;
};
