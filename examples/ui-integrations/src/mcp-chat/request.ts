import type { UIMessage } from 'ai';

export type ChatRequest = {
  messages: UIMessage[];
  modelContext: string[];
};

type Refusal = { status: number; message: string };

type Headers = { origin?: string | undefined; host?: string | undefined };

// /api/chat は手元の鍵で有料の API を呼ぶ。ほかのサイトのページから
// 投げられた要求で鍵を使わせないよう、同じオリジンからのものだけ通す
const refuseOtherOrigins = (headers: Headers): Refusal | null =>
  headers.origin !== undefined &&
  URL.parse(headers.origin)?.host !== headers.host
    ? { status: 403, message: 'Requests from another origin are refused.' }
    : null;

const isStrings = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');

export const parseChatRequest = (
  headers: Headers,
  body: unknown,
): ChatRequest | Refusal => {
  const refusal = refuseOtherOrigins(headers);
  if (refusal !== null) {
    return refusal;
  }
  if (typeof body !== 'object' || body === null) {
    return { status: 400, message: 'The body must be a JSON object.' };
  }
  const { messages, modelContext = [] } = body as Record<string, unknown>;
  if (!Array.isArray(messages) || messages.length === 0) {
    return { status: 400, message: 'messages must be a non-empty array.' };
  }
  if (!isStrings(modelContext)) {
    return { status: 400, message: 'modelContext must be an array of text.' };
  }
  return { messages: messages as UIMessage[], modelContext };
};

export const parseResourceRequest = (
  headers: Headers,
  body: unknown,
): { uri: string } | Refusal => {
  const refusal = refuseOtherOrigins(headers);
  if (refusal !== null) {
    return refusal;
  }
  const uri =
    typeof body === 'object' && body !== null
      ? (body as Record<string, unknown>).uri
      : undefined;
  return typeof uri === 'string' && uri.startsWith('ui://')
    ? { uri }
    : { status: 400, message: 'uri must be a ui:// resource.' };
};
