import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';

import type { Connect } from 'vite';
import { describe, expect, it } from 'vite-plus/test';

import {
  declaredHeaders,
  formatHeaders,
  headersPlugin,
  headersRefusal,
} from './headers';

describe('headersRefusal', () => {
  it('takes names and values HTTP can send', () => {
    expect(
      headersRefusal({
        'X-Content-Type-Options': 'nosniff',
        'Permissions-Policy': 'camera=(), microphone=()',
      }),
    ).toBeNull();
  });

  it('takes no headers at all', () => {
    expect(headersRefusal(undefined)).toBeNull();
  });

  it.each([
    ['a list of headers', [['X-A', 'b']], 'as an object of names and values'],
    ['a name with a space', { 'X A': 'b' }, 'a header named "X A"'],
    ['a name ending in a colon', { 'X-A:': 'b' }, 'a header named "X-A:"'],
    ['a value that is not text', { 'X-A': 1 }, 'the value of the header X-A'],
    ['an empty value', { 'X-A': '' }, 'the value of the header X-A'],
    ['a value padded with spaces', { 'X-A': ' b' }, 'the header X-A'],
    [
      'a value with a line break, which would start a rule of its own in _headers',
      { 'X-A': 'b\n/secret\n  X-B: c' },
      'holds a control character',
    ],
    [
      'one name in two spellings',
      { 'X-A': 'b', 'x-a': 'c' },
      'the header x-a twice',
    ],
  ])('refuses %s', (_name, given, said) => {
    expect(headersRefusal(given)).toContain(said);
  });
});

describe('formatHeaders', () => {
  it('writes the declared headers for every path', () => {
    expect(
      formatHeaders(
        { 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'origin' },
        null,
      ),
    ).toBe(
      [
        '# @k8ordo/framework: the headers framework() declared for every response',
        '/*',
        '  X-Content-Type-Options: nosniff',
        '  Referrer-Policy: origin',
        '',
      ].join('\n'),
    );
  });

  it('keeps the application’s own rules after them, as written', () => {
    expect(
      formatHeaders(
        { 'X-Content-Type-Options': 'nosniff' },
        '/feed\n  Cache-Control: max-age=600\n\n\n',
      ),
    ).toBe(
      [
        '# @k8ordo/framework: the headers framework() declared for every response',
        '/*',
        '  X-Content-Type-Options: nosniff',
        '',
        '/feed',
        '  Cache-Control: max-age=600',
        '',
      ].join('\n'),
    );
  });
});

describe('headersPlugin', () => {
  const HEADERS = { 'X-Content-Type-Options': 'nosniff', 'X-A': 'declared' };

  it.each(['configureServer', 'configurePreviewServer'] as const)(
    'sends the headers from %s, ahead of whatever answers, which may write a name over',
    async (hook) => {
      const used: Connect.NextHandleFunction[] = [];
      headersPlugin(HEADERS)[hook]({
        middlewares: { use: (handle) => used.push(handle) },
      });
      const server = createServer((request, response) => {
        used[0]?.(request, response, () => {
          response.writeHead(404, { 'X-A': 'answered' }).end();
        });
      });
      await new Promise<void>((resolve) => {
        server.listen(0, '127.0.0.1', resolve);
      });
      const { port } = server.address() as AddressInfo;

      const response = await fetch(`http://127.0.0.1:${String(port)}/nowhere`);
      server.close();

      expect(response.headers.get('x-content-type-options')).toBe('nosniff');
      expect(response.headers.get('x-a')).toBe('answered');
    },
  );

  it('lends a host adapter what was declared', () => {
    expect(
      declaredHeaders([{ name: 'k8ordo:engine' }, headersPlugin(HEADERS)]),
    ).toStrictEqual(HEADERS);
  });

  it('lends nothing where no framework() is among the plugins', () => {
    expect(declaredHeaders([{ name: 'vite:react' }])).toStrictEqual({});
  });
});
