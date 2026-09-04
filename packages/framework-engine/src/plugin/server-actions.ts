import { getPluginApi } from '@vitejs/plugin-rsc';
import type { ResolvedConfig } from 'vite';

/**
 * The modules that declared `'use server'`, as the RSC pipeline found them —
 * relative to the project root, in a stable order.
 *
 * A Server Action is compiled the same way in both modes, so "static has no
 * Server Actions" cannot be true by construction; it has to be checked.
 * `getPluginApi` is marked experimental by `@vitejs/plugin-rsc`, which is why
 * this package pins that dependency to an exact version rather than a range:
 * the surface cannot move underneath us without a deliberate bump.
 */
export const serverActionModules = (
  config: Pick<ResolvedConfig, 'plugins'>,
): string[] => {
  const api = getPluginApi(config);
  if (api === undefined) return [];
  return [...api.manager.serverReferences.metaMap.keys()]
    .map((id) => api.manager.toRelativeId(id))
    .toSorted();
};
