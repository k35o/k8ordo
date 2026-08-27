import { getToolName, isReasoningUIPart, isTextUIPart, isToolUIPart } from 'ai';
import type { UIMessage } from 'ai';

import type { ToolState } from '../../components/ai/types';

export type MappedPart =
  | { kind: 'text'; text: string }
  | { kind: 'reasoning'; text: string }
  | {
      kind: 'tool';
      name: string;
      toolCallId: string;
      state: ToolState;
      input?: unknown;
      output?: unknown;
      errorText?: string;
      deniedReason?: string;
    };

/**
 * AI SDK の `UIMessage.parts` を @k8ordo/ui の AI チャットコンポーネントに
 * 対応付けやすい素朴な配列へ変換する。React には依存せず、利用側が
 * `mapMessageParts(message).map(...)` で `Response` / `Reasoning` /
 * `ToolInvocation` を自分で描画する。
 */
export const mapMessageParts = (message: UIMessage): MappedPart[] => {
  const result: MappedPart[] = [];

  for (const part of message.parts) {
    if (isTextUIPart(part)) {
      result.push({ kind: 'text', text: part.text });
    } else if (isReasoningUIPart(part)) {
      result.push({ kind: 'reasoning', text: part.text });
    } else if (isToolUIPart(part)) {
      result.push({
        kind: 'tool',
        name: getToolName(part),
        toolCallId: part.toolCallId,
        state: part.state,
        input: part.input,
        output: part.state === 'output-available' ? part.output : undefined,
        errorText: part.state === 'output-error' ? part.errorText : undefined,
        deniedReason:
          part.state === 'output-denied' ? part.approval.reason : undefined,
      });
    }
  }

  return result;
};
