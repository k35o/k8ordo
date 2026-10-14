/**
 * Docs-only design-token view.
 *
 * Everything derivable comes from `@k8ordo/ui/tokens`, the DTCG resolver
 * document better-css-modules writes from the design system's CSS:
 *   - palette families / shades / hue ← the internal `<hue>-<shade>` tokens
 *   - semantic → palette mappings     ← the aliases at `:root` and in `.dark`
 *   - typography / scales / z-index   ← the tokens of each category
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

type Token = { $type?: string; $value: unknown };
type Tokens = Record<string, Token>;
type Color = {
  colorSpace: string;
  components: Array<number | 'none'>;
  alpha?: number;
};
type Dimension = { value: number; unit: string };
type Shadow = {
  color: Color | string;
  offsetX: Dimension;
  offsetY: Dimension;
  blur: Dimension;
  spread: Dimension;
  inset?: true;
};

// 型は文書そのもののリテラルなので、名前で引けるよう広い形に読み替える
const [root, ...modes] = (
  tokens as unknown as {
    resolutionOrder: [
      { sources: [Tokens] },
      ...Array<{ name: string; contexts: { on: [Tokens] } }>,
    ];
  }
).resolutionOrder;
const ROOT = root.sources[0];
const DARK = modes.find(({ name }) => name === '.dark')?.contexts.on[0] ?? {};

const tokenOf = (name: string): Token => {
  if (!Object.hasOwn(ROOT, name)) {
    throw new Error(`design-tokens: --${name} is not a token of @k8ordo/ui`);
  }
  return ROOT[name];
};

const aliasOf = (value: unknown): string | undefined =>
  typeof value === 'string' ? /^\{(.+)\}$/u.exec(value)?.[1] : undefined;

const dimension = ({ value, unit }: Dimension): string =>
  value === 0 ? '0' : `${String(value)}${unit}`;

const color = (value: Color | string): string => {
  const alias = typeof value === 'string' ? aliasOf(value) : undefined;
  if (alias !== undefined) return `var(--${alias})`;
  if (typeof value === 'string') return value;
  const alpha = value.alpha === undefined ? '' : ` / ${String(value.alpha)}`;
  const channels =
    value.colorSpace === 'srgb'
      ? value.components.map((channel) =>
          channel === 'none' ? channel : String(Math.round(channel * 255)),
        )
      : value.components.map(String);
  const fn = value.colorSpace === 'srgb' ? 'rgb' : value.colorSpace;
  return `${fn}(${channels.join(' ')}${alpha})`;
};

const shadow = ({ color: c, offsetX, offsetY, blur, spread, inset }: Shadow) =>
  [
    inset ? 'inset' : '',
    dimension(offsetX),
    dimension(offsetY),
    dimension(blur),
    dimension(spread),
    color(c),
  ]
    .filter(Boolean)
    .join(' ');

/** The token's value as CSS, aliases followed to the token they name. */
const cssValue = (name: string): string => {
  const { $type, $value } = tokenOf(name);
  const alias = aliasOf($value);
  if (alias !== undefined) return cssValue(alias);
  switch ($type) {
    case 'color':
      return color($value as Color);
    case 'dimension':
    case 'duration':
      return dimension($value as Dimension);
    case 'shadow':
      return (Array.isArray($value) ? $value : [$value])
        .map((part) => shadow(part as Shadow))
        .join(', ');
    case 'cubicBezier':
      return `cubic-bezier(${($value as number[]).join(', ')})`;
    case 'fontFamily':
      return (Array.isArray($value) ? $value : [$value]).join(', ');
    default:
      return String($value);
  }
};

/** `calc(a / b)` の行の高さは、DTCG に形が無いので CSS の文字列のまま来る。 */
const ratio = (value: string): number => {
  const match = /^calc\(\s*([\d.]+)\s*\/\s*([\d.]+)\s*\)$/u.exec(value);
  const number =
    match === null ? Number(value) : Number(match[1]) / Number(match[2]);
  if (Number.isNaN(number)) {
    throw new TypeError(`design-tokens: ${value} is not a line-height ratio`);
  }
  return Number(number.toFixed(6));
};

// 接頭辞の付いたトークンを、宣言の順に { 接頭辞を除いた名前, CSS の値 } で並べる
const scale = (
  prefix: string,
  keep: (token: Token, name: string) => boolean = () => true,
): NamedScale[] =>
  Object.entries(ROOT)
    .filter(
      ([name, token]) =>
        name.startsWith(prefix) && keep(token, name.slice(prefix.length)),
    )
    .map(([name]) => ({
      name: name.slice(prefix.length),
      value: cssValue(name),
    }));

/** Design rationale that does not exist in CSS; keyed by palette prefix. */
const PALETTE_DESCRIPTIONS: Record<string, string> = {
  gray: 'sky blue tint, minimal chroma for branded neutral',
  cyan: 'Secondary',
  teal: 'Primary',
};

const capitalize = (s: string): string =>
  s.charAt(0).toUpperCase() + s.slice(1);

// パレットは分類の無い `<hue>-<shade>` の色のトークン。宣言の順に並べ、色相は
// 最初の段の oklch から読む
const PALETTE_SHADE_RE = /^([a-z]+)-(\d+)$/u;
const shadeSet = new Set<number>();
const prefixOrder: string[] = [];
const hueByPrefix = new Map<string, number>();
for (const [name, token] of Object.entries(ROOT)) {
  const match = PALETTE_SHADE_RE.exec(name);
  if (match === null || token.$type !== 'color') continue;
  const [, prefix, shade] = match;
  shadeSet.add(Number(shade));
  if (!prefixOrder.includes(prefix)) {
    prefixOrder.push(prefix);
    const { components } = token.$value as Color;
    hueByPrefix.set(prefix, Number(components[2]));
  }
}

export const SHADES: readonly Shade[] = [...shadeSet].toSorted((a, b) => a - b);
export const PALETTE_PREFIXES: readonly string[] = prefixOrder;
export const WHITE: string = cssValue('white');

export const PALETTE: readonly PaletteFamily[] = PALETTE_PREFIXES.map(
  (prefix) => ({
    name: capitalize(prefix),
    prefix,
    hue: hueByPrefix.get(prefix) ?? Number.NaN,
    description: PALETTE_DESCRIPTIONS[prefix] ?? '',
    shades: Object.fromEntries(
      SHADES.map((shade) => [shade, cssValue(`${prefix}-${shade}`)]),
    ) as Record<Shade, string>,
  }),
);

// `{ name, light, dark }`。light と dark は、そのモードでトークンが指すパレットの段
const semanticTokens = (prefix: string): readonly SemanticToken[] =>
  Object.entries(ROOT)
    .filter(([name]) => name.startsWith(prefix))
    .map(([name, token]) => {
      const light = aliasOf(token.$value) ?? cssValue(name);
      return { name, light, dark: aliasOf(DARK[name]?.$value) ?? light };
    });

export const FG_TOKENS = semanticTokens('color-fg-');
export const BG_TOKENS = semanticTokens('color-bg-');
export const BORDER_TOKENS = semanticTokens('color-border-');
export const PRIMARY_TOKENS = semanticTokens('color-primary-');
export const SECONDARY_TOKENS = semanticTokens('color-secondary-');
export const GROUP_TOKENS = semanticTokens('color-group-');

// rem の文字の大きさごとに、対になる行の高さを持つ。em の大きさ（地の文の中の
// コードなど）はまわりの字に比例するので、段として並べない
export const TEXT_SIZES: readonly TextSize[] = scale(
  'font-size-',
  (token) => token.$type === 'dimension',
).map(({ name, value }) => ({
  name,
  fontSize: value,
  lineHeight: ratio(cssValue(`line-height-${name}`)),
}));

/** Line-height is already a numeric ratio; kept for call-site compatibility. */
export const lineHeightToNumber = (lineHeight: number): number => lineHeight;

export const FONT_WEIGHTS: readonly NamedScale[] = scale('font-weight-');
export const LETTER_SPACINGS: readonly NamedScale[] = scale('letter-spacing-');
// 文字の大きさと対の行の高さを除いた、文章の組みで選ぶ行の高さ
export const LINE_HEIGHTS: readonly NamedScale[] = scale(
  'line-height-',
  (_, name) => !Object.hasOwn(ROOT, `font-size-${name}`),
);
export const RADII: readonly NamedScale[] = scale(
  'radius-',
  (token) => token.$type === 'dimension',
);
export const SHADOWS: readonly NamedScale[] = scale(
  'shadow-',
  (_, name) => !name.startsWith('inset-') && !name.startsWith('ring-'),
);
export const INSET_SHADOWS: readonly NamedScale[] = scale('shadow-inset-');
export const SPACING: string = cssValue('spacing');
export const cssValueOf = cssValue;

// "64rem" のような単位付き文字列から数値部を取り出すため Number では NaN になる
const remToPx = (rem: string): string => `${Number.parseFloat(rem) * 16}px`;
export const BREAKPOINTS: readonly Breakpoint[] = scale('breakpoint-').map(
  ({ name, value }) => ({ name, rem: value, px: remToPx(value) }),
);

export const Z_INDICES: readonly NamedScale[] = scale('z-index-');

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
