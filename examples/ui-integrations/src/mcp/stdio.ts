import { readFile } from 'node:fs/promises';

import { StdioServerTransport } from '@modelcontextprotocol/server/stdio';

import { createMcpServer } from './server.ts';

const appHtml = new URL('../../dist/mcp-app/mcp-app.html', import.meta.url);

await createMcpServer({
  readAppHtml: () => readFile(appHtml, 'utf8'),
}).connect(new StdioServerTransport());
