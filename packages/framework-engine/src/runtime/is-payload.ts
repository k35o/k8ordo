/**
 * Whether what came back is this application's answer rather than the host's.
 *
 * Status is not the question: the framework answers a URL it does not have
 * with the not-found page under a real 404, and that is a page to render.
 * HTML is the question — it is what a static host serves for a file it does
 * have and for a URL it does not, and the one thing that certainly is not a
 * payload. A host that guesses some other type for `.rsc` is taken at its
 * word and the parse decides.
 */
export const isPayload = (response: Response): boolean => {
  const type = response.headers.get('content-type') ?? '';
  if (type.startsWith('text/html')) return false;
  return response.ok || type.startsWith('text/x-component');
};
