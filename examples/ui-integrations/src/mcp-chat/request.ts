import { refuseOtherOrigins } from '../ai-sdk/endpoint';
import type { Refusal } from '../ai-sdk/endpoint';

export const parseResourceRequest = (
  headers: { origin?: string | undefined; host?: string | undefined },
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
