import { defineLocalState } from '@k8ordo/state';
import * as z from 'zod/mini';

export type ColorScheme = 'light' | 'dark';

/**
 * A scheme, or `'system'`. As a visitor's preference, `'system'` is nothing
 * chosen, so the provider's default applies; as that default, it follows the
 * system.
 */
export type ColorSchemePreference = ColorScheme | 'system';

/**
 * Where the preference lives: localStorage, under
 * `k8ordo-state:color-scheme`. An absent `preference` is "nothing chosen",
 * so a visitor who never chose is never pinned to what the system said on
 * their first visit.
 */
export const colorSchemeState = defineLocalState(
  'color-scheme',
  z.object({ preference: z.optional(z.enum(['light', 'dark'])) }),
);

/** The media query the system answers through. */
export const DARK_QUERY = '(prefers-color-scheme: dark)';

/**
 * The class `@k8ordo/ui` reads on `<html>` (and Tailwind's `dark:` under a
 * class-based `@custom-variant dark`).
 */
export const DARK_CLASS = 'dark';

/**
 * The one rule: what the visitor chose wins, then what the provider was
 * told to start from, and `system` — the default's default — asks the
 * system.
 */
export const resolve = (
  preference: ColorScheme | undefined,
  defaultPreference: ColorSchemePreference,
  systemDark: boolean,
): ColorScheme => {
  const chosen =
    preference ??
    (defaultPreference === 'system' ? undefined : defaultPreference);
  return chosen ?? (systemDark ? 'dark' : 'light');
};

/**
 * The inline script the provider renders before its children: the rule
 * above, run before the first paint. The schema does not run there, so the
 * stored value is checked by hand and anything else reads as nothing
 * chosen — the same salvage the store applies.
 */
export const scriptFor = (defaultPreference: ColorSchemePreference): string =>
  `(()=>{const s=${colorSchemeState.inlineRead()};const v=s&&s.preference;const p=v==="dark"||v==="light"?v:${JSON.stringify(defaultPreference)};if(p==="dark"||(p!=="light"&&matchMedia(${JSON.stringify(DARK_QUERY)}).matches))document.documentElement.classList.add(${JSON.stringify(DARK_CLASS)})})()`;
