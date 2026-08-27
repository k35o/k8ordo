/**
 * Docs-only design-token view.
 *
 * Everything derivable comes from `@k8ordo/ui/tokens` (extracted from the
 * design system's CSS by `tailwind-token-extractor`):
 *   - palette families / shades / hue ← `tokens.vars` (`teal-500` keys, oklch hue)
 *   - semantic → palette mappings     ← `tokens.refs` (the symbolic var() targets)
 *   - typography / scales / z-index   ← `tokens.theme` / `tokens.vars`
 *
 * Only genuinely authored knowledge is hand-written here: the palette
 * descriptions (design rationale, not in CSS) and the spacing display scale
 * (a multiplicative view of the single `--spacing` unit).
 */
import { tokens } from '@k8ordo/ui/tokens';

export type Shade = number;

export type PaletteFamily = {
  name: string;
  prefix: string;
  hue: number;
  description: string;
  shades: Record<Shade, string>;
};

export type SemanticToken = { name: string; light: string; dark: string };
export type TextSize = { name: string; fontSize: string; lineHeight: number };
export type NamedScale = { name: string; value: string };
export type SpacingStep = { step: number; rem: string; px: string };
export type Breakpoint = { name: string; rem: string; px: string };

type Scalar = string | number;
type VarValue = Scalar | { light: Scalar; dark: Scalar };
const VARS = new Map<string, VarValue>(Object.entries(tokens.vars));
const THEME = tokens.theme as unknown as Record<
  string,
  Record<string, unknown>
>;
const REFS = tokens.refs as Record<string, { light: string; dark: string }>;

const scalarVar = (key: string): string => {
  const value = VARS.get(key);
  if (value === undefined) {
    throw new Error(
      `design-tokens: missing CSS variable --${key}; regenerate tokens.generated.ts`,
    );
  }
  return typeof value === 'object' ? String(value.light) : String(value);
};

const namedScale = (group: Record<string, unknown> | undefined): NamedScale[] =>
  Object.entries(group ?? {}).map(([name, value]) => ({
    name,
    value: String(value),
  }));

/** Design rationale that does not exist in CSS; keyed by palette prefix. */
const PALETTE_DESCRIPTIONS: Record<string, string> = {
  gray: 'sky blue tint, minimal chroma for branded neutral',
  cyan: 'Secondary',
  teal: 'Primary',
};

const valueOf = (v: VarValue): string =>
  typeof v === 'object' ? String(v.light) : String(v);
const isColor = (s: string): boolean => /^(oklch|rgb|hsl|#)/iu.test(s);
const hueOf = (oklch: string): number => {
  const m = /^oklch\(\s*\S+\s+\S+\s+(-?[\d.]+)/iu.exec(oklch.trim());
  return m?.[1] === undefined ? Number.NaN : Number(m[1]);
};
const capitalize = (s: string): string =>
  s.charAt(0).toUpperCase() + s.slice(1);

// Scan the raw var layer for `<prefix>-<shade>` color entries (e.g. `teal-500`),
// preserving CSS source order for families/shades. Hue is constant within a
// family, so it is read from the first shade encountered.
const PALETTE_SHADE_RE = /^([a-z]+)-(\d+)$/u;
const shadeSet = new Set<number>();
const prefixOrder: string[] = [];
const hueByPrefix = new Map<string, number>();
for (const [name, value] of VARS) {
  const m = PALETTE_SHADE_RE.exec(name);
  const prefix = m?.[1];
  const shade = m?.[2];
  if (prefix === undefined || shade === undefined) continue;
  const color = valueOf(value);
  if (!isColor(color)) continue;
  shadeSet.add(Number(shade));
  if (!prefixOrder.includes(prefix)) {
    prefixOrder.push(prefix);
    hueByPrefix.set(prefix, hueOf(color));
  }
}

export const SHADES: readonly Shade[] = [...shadeSet].toSorted((a, b) => a - b);
export const PALETTE_PREFIXES: readonly string[] = prefixOrder;

export const PALETTE: readonly PaletteFamily[] = PALETTE_PREFIXES.map(
  (prefix) => ({
    name: capitalize(prefix),
    prefix,
    hue: hueByPrefix.get(prefix) ?? Number.NaN,
    description: PALETTE_DESCRIPTIONS[prefix] ?? '',
    shades: Object.fromEntries(
      SHADES.map((shade) => [shade, scalarVar(`${prefix}-${shade}`)]),
    ) as Record<Shade, string>,
  }),
);

// Each entry is `{ name, light, dark }` where light/dark are the palette shade
// the semantic var aliases in that mode — recovered from the CSS, not hand-kept.
const semanticTokens = (prefix: string): readonly SemanticToken[] =>
  Object.entries(REFS)
    .filter(([name]) => name.startsWith(prefix))
    .map(([name, ref]) => ({ name, light: ref.light, dark: ref.dark }));

export const FG_TOKENS = semanticTokens('fg-');
export const BG_TOKENS = semanticTokens('bg-');
export const BORDER_TOKENS = semanticTokens('border-');
export const PRIMARY_TOKENS = semanticTokens('primary-');
export const SECONDARY_TOKENS = semanticTokens('secondary-');
export const GROUP_TOKENS = semanticTokens('group-');

type GeneratedText = {
  value: string;
  lineHeight: Scalar;
  lineHeightNumber?: number;
};
const TEXT = tokens.theme.text as unknown as Record<string, GeneratedText>;

const lineHeightOf = (name: string, t: GeneratedText): number => {
  if (t.lineHeightNumber !== undefined) return t.lineHeightNumber;
  if (typeof t.lineHeight === 'number') return t.lineHeight;
  throw new Error(
    `design-tokens: text size "${name}" has no numeric line-height; regenerate tokens.generated.ts`,
  );
};

export const TEXT_SIZES: readonly TextSize[] = Object.entries(TEXT).map(
  ([name, t]) => ({
    name,
    fontSize: t.value,
    lineHeight: lineHeightOf(name, t),
  }),
);

/** Line-height is already a numeric ratio; kept for call-site compatibility. */
export const lineHeightToNumber = (lineHeight: number): number => lineHeight;

export const FONT_WEIGHTS: readonly NamedScale[] = namedScale(
  THEME['font-weight'],
);
export const LETTER_SPACINGS: readonly NamedScale[] = namedScale(
  THEME['tracking'],
);
export const LINE_HEIGHTS: readonly NamedScale[] = namedScale(THEME['leading']);
export const RADII: readonly NamedScale[] = namedScale(THEME['radius']);
export const SHADOWS: readonly NamedScale[] = namedScale(THEME['shadow']);

// eslint-disable-next-line unicorn/prefer-number-coercion -- "64rem" のような単位付き文字列から数値部を取り出すため Number では NaN になる
const remToPx = (rem: string): string => `${Number.parseFloat(rem) * 16}px`;
export const BREAKPOINTS: readonly Breakpoint[] = Object.entries(
  THEME['breakpoint'] ?? {},
).map(([name, rem]) => ({ name, rem: String(rem), px: remToPx(String(rem)) }));

export const Z_INDICES: readonly NamedScale[] = Object.keys(tokens.vars)
  .filter((name) => name.startsWith('z-'))
  .map((name) => ({ name: name.slice(2), value: scalarVar(name) }));

/** Display scale for docs — not derivable from CSS. */
export const SPACING_SCALE: readonly SpacingStep[] = [
  { step: 0.5, rem: '0.125rem', px: '2px' },
  { step: 1, rem: '0.25rem', px: '4px' },
  { step: 2, rem: '0.5rem', px: '8px' },
  { step: 3, rem: '0.75rem', px: '12px' },
  { step: 4, rem: '1rem', px: '16px' },
  { step: 5, rem: '1.25rem', px: '20px' },
  { step: 6, rem: '1.5rem', px: '24px' },
  { step: 8, rem: '2rem', px: '32px' },
  { step: 10, rem: '2.5rem', px: '40px' },
  { step: 12, rem: '3rem', px: '48px' },
  { step: 16, rem: '4rem', px: '64px' },
  { step: 20, rem: '5rem', px: '80px' },
  { step: 24, rem: '6rem', px: '96px' },
];
