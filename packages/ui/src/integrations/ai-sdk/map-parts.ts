import {
  getToolName,
  isDataUIPart,
  isFileUIPart,
  isReasoningUIPart,
  isTextUIPart,
  isToolUIPart,
} from 'ai';
import type { UIMessage } from 'ai';

import type { ToolApproval, ToolState } from '../../components/ai/types';

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
      approval?: ToolApproval;
    }
  | { kind: 'file'; url: string; mediaType: string; filename?: string }
  | {
      kind: 'source';
      id: string;
      /** `source-url` のときだけある */
      url?: string;
      title?: string;
      /** `source-document` のときだけある */
      mediaType?: string;
      filename?: string;
    }
  | { kind: 'data'; name: string; id?: string; data: unknown };

/**
 * AI SDK の `UIMessage.parts` を @k8ordo/ui の AI チャットコンポーネントに
 * 対応付けやすい素朴な配列へ変換する。React には依存せず、利用側が
 * `mapMessageParts(message).map(...)` で `Response` / `Reasoning` /
 * `ToolInvocation` / `Attachment` / `Source` を自分で描画する。
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
        approval: part.approval,
      });
    } else if (isFileUIPart(part)) {
      result.push({
        kind: 'file',
        url: part.url,
        mediaType: part.mediaType,
        filename: part.filename,
      });
    } else if (part.type === 'source-url') {
      result.push({
        kind: 'source',
        id: part.sourceId,
        url: part.url,
        title: part.title,
      });
    } else if (part.type === 'source-document') {
      result.push({
        kind: 'source',
        id: part.sourceId,
        title: part.title,
        mediaType: part.mediaType,
        filename: part.filename,
      });
    } else if (isDataUIPart(part)) {
      result.push({
        kind: 'data',
        name: part.type.slice('data-'.length),
        id: part.id,
        data: part.data,
      });
    }
  }

  return result;
};
