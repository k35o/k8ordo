import type { UIMessage } from 'ai';

import { mapMessageParts } from './map-parts';

const messageWith = (parts: unknown[]): UIMessage =>
  ({ id: 'm', role: 'assistant', parts }) as unknown as UIMessage;

describe('mapMessageParts', () => {
  it('maps text / reasoning / tool parts preserving order', () => {
    const message = messageWith([
      { type: 'step-start' },
      { type: 'reasoning', text: 'まず器から作る' },
      { type: 'text', text: 'こんにちは' },
      {
        type: 'tool-search',
        toolCallId: 'c1',
        state: 'output-available',
        input: { q: 'x' },
        output: 'result',
      },
    ]);

    expect(mapMessageParts(message)).toStrictEqual([
      { kind: 'reasoning', text: 'まず器から作る' },
      { kind: 'text', text: 'こんにちは' },
      {
        kind: 'tool',
        name: 'search',
        toolCallId: 'c1',
        state: 'output-available',
        input: { q: 'x' },
        output: 'result',
        errorText: undefined,
        approval: undefined,
      },
    ]);
  });

  it('maps dynamic-tool with the error state', () => {
    const message = messageWith([
      {
        type: 'dynamic-tool',
        toolName: 'run',
        toolCallId: 'c2',
        state: 'output-error',
        input: {},
        errorText: 'boom',
      },
    ]);

    expect(mapMessageParts(message)).toStrictEqual([
      {
        kind: 'tool',
        name: 'run',
        toolCallId: 'c2',
        state: 'output-error',
        input: {},
        output: undefined,
        errorText: 'boom',
        approval: undefined,
      },
    ]);
  });

  it('keeps the approval id of a pending approval so the answer can be sent back', () => {
    const message = messageWith([
      {
        type: 'tool-deleteFile',
        toolCallId: 'c3',
        state: 'approval-requested',
        input: { path: 'notes.md' },
        approval: { id: 'a1', requestReason: 'ファイルを消します' },
      },
    ]);

    expect(mapMessageParts(message)).toStrictEqual([
      {
        kind: 'tool',
        name: 'deleteFile',
        toolCallId: 'c3',
        state: 'approval-requested',
        input: { path: 'notes.md' },
        output: undefined,
        errorText: undefined,
        approval: { id: 'a1', requestReason: 'ファイルを消します' },
      },
    ]);
  });

  it('maps the denied state with the approval and its reason', () => {
    const message = messageWith([
      {
        type: 'tool-search',
        toolCallId: 'c4',
        state: 'output-denied',
        input: { q: 'x' },
        approval: { id: 'a2', approved: false, reason: '外部検索は無効' },
      },
    ]);

    expect(mapMessageParts(message)).toStrictEqual([
      {
        kind: 'tool',
        name: 'search',
        toolCallId: 'c4',
        state: 'output-denied',
        input: { q: 'x' },
        output: undefined,
        errorText: undefined,
        approval: { id: 'a2', approved: false, reason: '外部検索は無効' },
      },
    ]);
  });

  it('maps file parts', () => {
    const message = messageWith([
      {
        type: 'file',
        mediaType: 'image/png',
        filename: 'chart.png',
        url: 'data:image/png;base64,AAAA',
      },
    ]);

    expect(mapMessageParts(message)).toStrictEqual([
      {
        kind: 'file',
        url: 'data:image/png;base64,AAAA',
        mediaType: 'image/png',
        filename: 'chart.png',
      },
    ]);
  });

  it('maps url and document sources to the same kind', () => {
    const message = messageWith([
      {
        type: 'source-url',
        sourceId: 's1',
        url: 'https://example.com/a',
        title: 'Example',
      },
      {
        type: 'source-document',
        sourceId: 's2',
        mediaType: 'application/pdf',
        title: '仕様書',
        filename: 'spec.pdf',
      },
    ]);

    expect(mapMessageParts(message)).toStrictEqual([
      {
        kind: 'source',
        id: 's1',
        url: 'https://example.com/a',
        title: 'Example',
      },
      {
        kind: 'source',
        id: 's2',
        title: '仕様書',
        mediaType: 'application/pdf',
        filename: 'spec.pdf',
      },
    ]);
  });

  it('maps data parts with the name after `data-`', () => {
    const message = messageWith([
      {
        type: 'data-weather',
        id: 'w1',
        data: { city: 'Tokyo', celsius: 21 },
      },
    ]);

    expect(mapMessageParts(message)).toStrictEqual([
      {
        kind: 'data',
        name: 'weather',
        id: 'w1',
        data: { city: 'Tokyo', celsius: 21 },
      },
    ]);
  });

  it('skips unsupported parts', () => {
    const message = messageWith([
      { type: 'step-start' },
      { type: 'custom', kind: 'openai.image' },
      {
        type: 'reasoning-file',
        mediaType: 'image/png',
        url: 'https://example.com/x',
      },
    ]);

    expect(mapMessageParts(message)).toStrictEqual([]);
  });
});
