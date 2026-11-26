export const FORMATS = ['a2ui', 'json-render', 'openui'] as const;

export type Format = (typeof FORMATS)[number];

/** One turn of the conversation. A user turn is the request or a report of what the user did. */
export type Turn = { role: 'user' | 'assistant'; content: string };

export type GenerateRequest = { format: Format; messages: Turn[] };

/** One line of the NDJSON the endpoint streams back. */
export type GenerateEvent =
  | { type: 'text'; text: string }
  | { type: 'restart'; model: string }
  | { type: 'done' }
  | { type: 'error'; message: string };

const isFormat = (value: unknown): value is Format =>
  FORMATS.some((format) => format === value);

const isConversation = (value: unknown): value is Turn[] =>
  Array.isArray(value) &&
  value.length % 2 === 1 &&
  value.every((turn: unknown, index) => {
    if (typeof turn !== 'object' || turn === null) {
      return false;
    }
    const { role, content } = turn as Record<string, unknown>;
    return (
      role === (index % 2 === 0 ? 'user' : 'assistant') &&
      typeof content === 'string' &&
      content.trim() !== ''
    );
  });

/**
 * Checks a request to the endpoint before anything is spent on it. A request
 * from another origin is refused: the endpoint calls a paid API with the
 * developer's key, and a page on another site could otherwise post to it.
 */
export const parseGenerateRequest = (
  headers: { origin?: string | undefined; host?: string | undefined },
  body: unknown,
): GenerateRequest | { status: number; message: string } => {
  if (
    headers.origin !== undefined &&
    URL.parse(headers.origin)?.host !== headers.host
  ) {
    return {
      status: 403,
      message: 'Requests from another origin are refused.',
    };
  }
  if (typeof body !== 'object' || body === null) {
    return { status: 400, message: 'The body must be a JSON object.' };
  }
  const { format, messages } = body as Record<string, unknown>;
  if (!isFormat(format)) {
    return {
      status: 400,
      message: `format must be one of ${FORMATS.join(', ')}.`,
    };
  }
  if (!isConversation(messages)) {
    return {
      status: 400,
      message:
        'messages must alternate user and assistant turns of non-empty text, from a user turn to a user turn.',
    };
  }
  return { format, messages };
};
