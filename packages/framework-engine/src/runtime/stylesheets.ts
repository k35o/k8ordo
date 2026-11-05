/** The precedence the RSC plugin links a Server Component's stylesheet with. */
export const SERVER_STYLESHEETS = 'vite-rsc/importer-resources';

/** The precedence the RSC plugin links a client component's stylesheet with. */
export const CLIENT_STYLESHEETS = 'vite-rsc/client-reference';

/**
 * The `href` of the one `<style>` the HTML render writes itself, empty, under
 * `SERVER_STYLESHEETS`. React orders the precedences in `<head>` as each is
 * first asked for, and puts a stylesheet loaded later after the last of its
 * own; asked for first, this keeps the Server Components' stylesheets before
 * the client components'. Under mode: 'static' it carries no nonce, and the
 * build names it by hash where the policy decides a style element.
 */
export const STYLESHEET_ORDER_HREF = 'k8ordo-stylesheet-order';
