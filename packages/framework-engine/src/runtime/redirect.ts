/** A redirect thrown from a Server Action. */
export class Redirect extends Error {
  constructor(readonly to: string) {
    super(`redirect to ${to}`);
    this.name = 'Redirect';
  }
}

/**
 * Ends a Server Action by sending the visitor somewhere else. Thrown, so an
 * action reads the way it did before the redirect was added — the lines
 * after it never run. A form posted without JavaScript is answered with a
 * `303` to `to`; one posted by the client runtime is answered with a
 * payload that tells the browser to navigate there.
 */
export const redirect = (to: string): never => {
  throw new Redirect(to);
};
