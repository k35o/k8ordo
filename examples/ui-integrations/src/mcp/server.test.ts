import { Client } from '@modelcontextprotocol/client';
import { RESOURCE_MIME_TYPE } from '@modelcontextprotocol/ext-apps/server';
import { InMemoryTransport } from '@modelcontextprotocol/server';
import { afterEach, expect, it } from 'vite-plus/test';

import { createMcpServer } from './server';
import { APP_URI, SHOW_UI } from './show-ui';

const APP_HTML = '<!doctype html><title>app</title>';

const clients: Client[] = [];

const connect = async (): Promise<Client> => {
  const [clientTransport, serverTransport] =
    InMemoryTransport.createLinkedPair();
  await createMcpServer({ readAppHtml: async () => APP_HTML }).connect(
    serverTransport,
  );
  const client = new Client({ name: 'test', version: '1.0.0' });
  await client.connect(clientTransport);
  clients.push(client);
  return client;
};

afterEach(async () => {
  await Promise.all(clients.splice(0).map((client) => client.close()));
});

it('show_ui は App のリソースを _meta.ui.resourceUri で指す', async () => {
  const client = await connect();

  const { tools } = await client.listTools();

  expect(tools).toStrictEqual([
    expect.objectContaining({
      name: SHOW_UI,
      _meta: expect.objectContaining({ ui: { resourceUri: APP_URI } }),
    }),
  ]);
});

it('App のリソースは、MCP App の MIME で 1 枚の HTML を返す', async () => {
  const client = await connect();

  const { contents } = await client.readResource({ uri: APP_URI });

  expect(contents).toStrictEqual([
    { uri: APP_URI, mimeType: RESOURCE_MIME_TYPE, text: APP_HTML },
  ]);
});

it('カタログに合わない画面は、直すところを添えてエラーで返す', async () => {
  const client = await connect();

  const result = await client.callTool({
    name: SHOW_UI,
    arguments: { components: [{ id: 'root', component: 'PieChart' }] },
  });

  expect(result.isError).toBe(true);
  expect(JSON.stringify(result.content)).toContain(
    '[root] PieChart is not in the catalog.',
  );
});

it('カタログに合う画面は、見せたことを返す', async () => {
  const client = await connect();

  const result = await client.callTool({
    name: SHOW_UI,
    arguments: {
      components: [{ id: 'root', component: 'Heading', label: '会員登録' }],
    },
  });

  expect(result.isError).not.toBe(true);
});
