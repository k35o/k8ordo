import { readFile } from 'node:fs/promises';

import { toNodeHandler } from '@modelcontextprotocol/node';
import {
  createMcpHandler,
  hostHeaderValidationResponse,
  localhostAllowedHostnames,
  localhostAllowedOrigins,
  originValidationResponse,
} from '@modelcontextprotocol/server';

import { createMcpServer } from './server.ts';

const appHtml = new URL('../../dist/mcp-app/mcp-app.html', import.meta.url);

const mcp = createMcpHandler(() =>
  createMcpServer({ readAppHtml: () => readFile(appHtml, 'utf8') }),
);

// 手元のサーバーは、ほかのサイトのページからも fetch で叩ける。MCP SDK が
// 求めるとおり、localhost 以外の Host と Origin を断ってから渡す
export const handleMcp = toNodeHandler({
  fetch: async (request) =>
    hostHeaderValidationResponse(request, localhostAllowedHostnames()) ??
    originValidationResponse(request, localhostAllowedOrigins()) ??
    mcp.fetch(request),
});
