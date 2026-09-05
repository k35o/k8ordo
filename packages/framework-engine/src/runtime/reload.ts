/**
 * Ending the page and asking the server for it again — the framework's one
 * way of giving up on the client. Its own module because `location.reload`
 * cannot be replaced (the Location interface is unforgeable), so this name is
 * the only seam from which a test can watch the framework give up.
 */
export const reloadDocument = (): void => {
  location.reload();
};
