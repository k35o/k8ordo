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

const systemQuery = (scheme: ColorScheme): string =>
  `(prefers-color-scheme: ${scheme})`;

/** The media query the system answers through. */
export const DARK_QUERY = systemQuery('dark');

/**
 * The class `@k8ordo/ui` reads on `<html>` (and Tailwind's `dark:` under a
 * class-based `@custom-variant dark`).
 */
export const DARK_CLASS = 'dark';

/**
 * The attribute that marks the theme-color `<meta>` the inline script
 * writes, naming the scheme its colour is for.
 */
export const THEME_COLOR_ATTRIBUTE = 'data-color-scheme';

/**
 * The scheme the system has no say in: what the visitor chose, else the
 * default the provider was told to start from — `undefined` while that
 * default is `system`, the default's default, and the visitor never chose.
 */
export const pinnedScheme = (
  preference: ColorScheme | undefined,
  defaultPreference: ColorSchemePreference,
): ColorScheme | undefined =>
  preference ??
  (defaultPreference === 'system' ? undefined : defaultPreference);

/** The one rule: the pinned scheme wins, and nothing pinned asks the system. */
export const resolve = (
  preference: ColorScheme | undefined,
  defaultPreference: ColorSchemePreference,
  systemDark: boolean,
): ColorScheme =>
  pinnedScheme(preference, defaultPreference) ??
  (systemDark ? 'dark' : 'light');

/**
 * The `media` of the theme-color `<meta>` for `scheme`. While nothing is
 * pinned it is that scheme's `prefers-color-scheme`, so the browser follows
 * the system on its own, as it changes; once a scheme is pinned, the pinned
 * one applies everywhere and the other nowhere.
 */
export const themeColorMedia = (
  scheme: ColorScheme,
  pinned: ColorScheme | undefined,
): string => {
  if (pinned === undefined) return systemQuery(scheme);
  return pinned === scheme ? 'all' : 'not all';
};

/**
 * What the inline script carries — the props `ColorSchemeScript` takes, its
 * nonce aside — and so what its hash depends on.
 */
export type ColorSchemeScriptOptions = {
  /**
   * The `defaultPreference` the provider is given. The script applies it
   * before the first paint to a visitor who has chosen nothing, so the two
   * have to say the same.
   */
  readonly defaultPreference?: ColorSchemePreference;
  /**
   * The colour the browser paints its own UI in — the address bar, the
   * status bar — for each scheme; the page's background, usually. The
   * script writes it as `<meta name="theme-color">`, one for each scheme,
   * and the provider keeps them in step with the scheme on screen.
   */
  readonly themeColor?: { readonly light: string; readonly dark: string };
};

/**
 * The inline script `ColorSchemeScript` renders: the rule above, run before
 * the first paint. The schema does not run there, so the stored value is
 * checked by hand and anything else reads as nothing chosen — the same
 * salvage the store applies.
 */
export const scriptFor = ({
  defaultPreference = 'system',
  themeColor,
}: ColorSchemeScriptOptions = {}): string => {
  const scheme = `const s=${colorSchemeState.inlineRead()};const v=s&&s.preference;const p=v==="dark"||v==="light"?v:${JSON.stringify(defaultPreference)};if(p==="dark"||(p!=="light"&&matchMedia(${JSON.stringify(DARK_QUERY)}).matches))document.documentElement.classList.add(${JSON.stringify(DARK_CLASS)})`;
  if (themeColor === undefined) return `(()=>{${scheme}})()`;
  // React は <meta> をスタイルシートの後ろに書き、スクリプトはその前で動くので、
  // meta はスクリプトが作る。並びを固定して、渡したオブジェクトのキーの順で
  // ハッシュが変わらないようにする
  const metas = JSON.stringify(
    (['light', 'dark'] as const).map((each) => [
      each,
      themeColor[each],
      systemQuery(each),
    ]),
  );
  return `(()=>{${scheme};for(const[k,c,q]of ${metas}){const m=document.createElement("meta");m.name="theme-color";m.content=c;m.setAttribute(${JSON.stringify(THEME_COLOR_ATTRIBUTE)},k);m.media=p==="system"?q:p===k?"all":"not all";document.head.append(m)}})()`;
};

/**
 * The inline script's hash as a CSP source, `'sha256-…'`, for a policy that
 * allows it by what it is rather than by a nonce — the static mode's `csp`
 * option, or a header that names no nonce. Give it what `ColorSchemeScript`
 * is given, its nonce aside: the script carries it.
 */
export const colorSchemeScriptHash = async (
  options: ColorSchemeScriptOptions = {},
): Promise<string> => {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(scriptFor(options)),
  );
  return `'sha256-${btoa(String.fromCodePoint(...new Uint8Array(digest)))}'`;
};
