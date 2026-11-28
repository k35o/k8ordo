import type { UIMessage } from 'ai';
import { describe, expect, it } from 'vite-plus/test';

import { modelPartOf, stepsOf } from './screens';
import type { ScreenAction } from './screens';

const form = {
  components: [{ id: 'root', component: 'Stack', children: [] }],
  dataModel: { nickname: '' },
};

describe('stepsOf', () => {
  it('サーバーが受け付けた画面の呼び出しだけを、順に拾う', () => {
    const messages: UIMessage[] = [
      {
        id: 'a1',
        role: 'assistant',
        parts: [
          {
            type: 'tool-show_ui',
            toolCallId: 'call-1',
            state: 'output-available',
            input: form,
            output: { screen: 'call-1' },
          },
          {
            type: 'tool-show_ui',
            toolCallId: 'call-2',
            state: 'output-error',
            input: { components: [] },
            errorText: 'No component has the id "root".',
          },
          {
            type: 'tool-searchDocs',
            toolCallId: 'call-3',
            state: 'output-available',
            input: { query: 'Button' },
            output: { hits: 1 },
          },
        ],
      },
      {
        id: 'u1',
        role: 'user',
        parts: [{ type: 'text', text: '保存して' }],
      },
      {
        id: 'a2',
        role: 'assistant',
        parts: [
          {
            type: 'tool-update_ui',
            toolCallId: 'call-4',
            state: 'output-available',
            input: { screen: 'call-1', values: { '/nickname': 'ordo' } },
            output: { screen: 'call-1' },
          },
          {
            type: 'tool-show_ui',
            toolCallId: 'call-5',
            state: 'input-streaming',
            input: { components: [] },
          },
        ],
      },
    ];

    expect(stepsOf(messages)).toStrictEqual([
      { kind: 'show', screen: 'call-1', input: form },
      {
        kind: 'update',
        screen: 'call-1',
        input: { values: { '/nickname': 'ordo' } },
      },
    ]);
  });
});

describe('modelPartOf', () => {
  it('押した操作を、画面と操作と状態の報告にする', () => {
    const action: ScreenAction = {
      screen: 'call-1',
      name: 'save',
      sourceComponentId: 'save',
      context: { nickname: 'ordo' },
      text: '保存します',
      state: { nickname: 'ordo' },
    };

    expect(modelPartOf({ type: 'data-action', data: action })).toStrictEqual({
      type: 'text',
      text: [
        'The user acted on the screen call-1.',
        'Action: {"name":"save","sourceComponentId":"save","context":{"nickname":"ordo"}}',
        'State of the screen now: {"nickname":"ordo"}',
      ].join('\n'),
    });
  });

  it('ほかの data パーツは、会話に入れない', () => {
    expect(modelPartOf({ type: 'data-ui', data: {} })).toBeUndefined();
  });
});
