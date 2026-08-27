/**
 * Public design-token API for `@k8ordo/ui`.
 *
 * `index.css` (composed from `base.css`, `tokens.css`, and `utilities.css`) is
 * the single source of truth. `tailwind-token-extractor` reads it and writes the
 * fully-resolved tokens to `tokens.generated.ts`. Run `pnpm generate:tokens`
 * after editing any of those partials.
 *
 * Exposes `tokens` ({ theme, vars }), `meta`, and the derived key-union types.
 */
export * from './tokens.generated';
