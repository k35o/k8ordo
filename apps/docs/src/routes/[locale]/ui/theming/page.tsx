import { CodeBlock } from '@k8ordo/ui/code-block';

import { Pitfall } from '../../../../components/callout';
import {
  DocPage,
  DocSection,
  DocSubsection,
} from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import { TokenCard } from '../../../../components/token-card';
import * as m from '../../../../messages';
import {
  BG_TOKENS,
  BORDER_TOKENS,
  BREAKPOINTS,
  FG_TOKENS,
  FONT_WEIGHTS,
  GROUP_TOKENS,
  LETTER_SPACINGS,
  LINE_HEIGHTS,
  PALETTE,
  PRIMARY_TOKENS,
  RADII,
  SECONDARY_TOKENS,
  SHADES,
  SHADOWS,
  SPACING_SCALE,
  TEXT_SIZES,
  Z_INDICES,
  lineHeightToNumber,
} from '../../../../theme/design-tokens';

const t = m.theming;

const DARK = `document.documentElement.classList.add('dark');`;

const CONTRAST = `const pressedStyles = [
  'aria-pressed:bg-primary-bg-emphasize',
  'forced-colors:aria-pressed:bg-[Highlight]',
  'forced-colors:aria-pressed:text-[HighlightText]',
].join(' ');`;

const OVERRIDE = `:root {
  --primary-fg: var(--purple-800);
  --primary-bg: var(--purple-200);
  --primary-bg-subtle: var(--purple-50);
  --primary-bg-mute: var(--purple-100);
  --primary-bg-emphasize: var(--purple-300);
  --primary-border: var(--purple-500);
}

.dark {
  --primary-fg: var(--purple-300);
  --primary-bg: var(--purple-800);
  --primary-bg-subtle: var(--purple-950);
  --primary-bg-mute: var(--purple-900);
  --primary-bg-emphasize: var(--purple-700);
  --primary-border: var(--purple-500);
}`;

const OVERRIDE_VALUE = `:root {
  --primary-border: oklch(0.55 0.15 300);
}`;

const Z_INDEX_USAGE = {
  overlay: 'Popover, DropdownMenu, ListBox, Tooltip',
  modal: 'Modal, Drawer',
  toast: 'Toast',
} as const;

export default function Theming() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/ui/theming">
      <DocSection id="semantic" title={t.semanticColorsTitle}>
        <p>
          <Rich>{t.semanticColorsIntro()}</Rich>
        </p>
        <DocSubsection id="foreground" title={t.foregroundTitle}>
          <div className="grid gap-2 sm:grid-cols-2">
            {FG_TOKENS.map((token) => (
              <TokenCard key={token.name} token={token} />
            ))}
          </div>
        </DocSubsection>
        <DocSubsection id="background" title={t.backgroundTitle}>
          <div className="grid gap-2 sm:grid-cols-2">
            {BG_TOKENS.map((token) => (
              <TokenCard key={token.name} token={token} />
            ))}
          </div>
        </DocSubsection>
        <DocSubsection id="border" title={t.borderTitle}>
          <div className="grid gap-2 sm:grid-cols-2">
            {BORDER_TOKENS.map((token) => (
              <TokenCard key={token.name} token={token} type="border" />
            ))}
          </div>
        </DocSubsection>
      </DocSection>

      <DocSection id="brand" title={t.brandColorsTitle}>
        <p>
          <Rich>{t.brandColorsIntro()}</Rich>
        </p>
        <DocSubsection id="primary" title={t.primaryTitle}>
          <div className="grid gap-2 sm:grid-cols-2">
            {PRIMARY_TOKENS.map((token) => (
              <TokenCard
                key={token.name}
                token={token}
                type={token.name.includes('border') ? 'border' : 'fill'}
              />
            ))}
          </div>
        </DocSubsection>
        <DocSubsection id="secondary" title={t.secondaryTitle}>
          <div className="grid gap-2 sm:grid-cols-2">
            {SECONDARY_TOKENS.map((token) => (
              <TokenCard
                key={token.name}
                token={token}
                type={token.name.includes('border') ? 'border' : 'fill'}
              />
            ))}
          </div>
        </DocSubsection>
        <DocSubsection id="group" title={t.groupTitle}>
          <div className="grid gap-2 sm:grid-cols-2">
            {GROUP_TOKENS.map((token) => (
              <TokenCard key={token.name} token={token} />
            ))}
          </div>
        </DocSubsection>
      </DocSection>

      <DocSection id="palette" title={t.colorPaletteTitle}>
        <div className="flex flex-col gap-4">
          {PALETTE.map((family) => (
            <div className="flex flex-col gap-1" key={family.prefix}>
              <span className="text-sm font-medium">{family.name}</span>
              <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-11">
                {SHADES.map((shade) => (
                  <div
                    className="flex flex-col items-center gap-1"
                    key={shade}
                    title={family.shades[shade]}
                  >
                    <div
                      className="border-border-mute aspect-square w-full rounded-md border"
                      style={{ backgroundColor: family.shades[shade] }}
                    />
                    <span className="text-xs font-medium">{shade}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p>
          <Rich>{t.colorPaletteShades()}</Rich>
        </p>
        <p>
          <Rich>{t.colorPaletteUsage()}</Rich>
        </p>
      </DocSection>

      <DocSection id="customize" title={t.customizeTitle}>
        <CodeBlock code={OVERRIDE} lang="css" title="app.css" />
        <CodeBlock code={OVERRIDE_VALUE} lang="css" title="app.css" />
        <p>
          <Rich>{t.customizeHow()}</Rich>
        </p>
        <p>
          <Rich>{t.customizePalette()}</Rich>
        </p>
        <p>
          <Rich>{t.customizeContrast()}</Rich>
        </p>
      </DocSection>

      <DocSection id="typography" title={t.typographyTitle}>
        <DocSubsection id="text-sizes" title={t.textSizesTitle}>
          <div className="border-border-mute bg-bg-surface rounded-xl border">
            <div className="flex flex-col gap-3 p-4">
              {TEXT_SIZES.map((size) => {
                const ratio = lineHeightToNumber(size.lineHeight);
                return (
                  <div className="flex items-baseline gap-4" key={size.name}>
                    <code className="text-fg-subtle w-20 shrink-0 text-sm">
                      {size.name}
                    </code>
                    {/* min-w-0 がないと flex item の min-width:auto により
                        text-highlight(6rem) の見本幅がページ全体を押し広げる */}
                    <span
                      className="min-w-0 truncate"
                      style={{ fontSize: size.fontSize, lineHeight: ratio }}
                    >
                      k8ordo
                    </span>
                    <span className="text-fg-subtle ml-auto shrink-0 text-xs">
                      {size.fontSize} / {Number(ratio.toFixed(3))}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </DocSubsection>
        <DocSubsection id="font-weights" title={t.fontWeightsTitle}>
          <div className="border-border-mute bg-bg-surface rounded-xl border">
            <div className="flex flex-col gap-3 p-4">
              {FONT_WEIGHTS.map((weight) => (
                <div className="flex items-baseline gap-4" key={weight.name}>
                  <code className="text-fg-subtle w-20 shrink-0 text-sm">
                    {weight.name}
                  </code>
                  <span
                    className="text-lg"
                    style={{ fontWeight: weight.value }}
                  >
                    k8ordo
                  </span>
                  <span className="text-fg-subtle ml-auto shrink-0 text-xs">
                    {weight.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <p>
            <Rich>{t.fontWeightsNote()}</Rich>
          </p>
        </DocSubsection>
        <DocSubsection id="letter-spacing" title={t.letterSpacingTitle}>
          <div className="border-border-mute bg-bg-surface rounded-xl border">
            <div className="flex flex-col gap-3 p-4">
              {LETTER_SPACINGS.map((ls) => (
                <div className="flex items-baseline gap-4" key={ls.name}>
                  <code className="text-fg-subtle w-20 shrink-0 text-sm">
                    {ls.name}
                  </code>
                  <span className="text-lg" style={{ letterSpacing: ls.value }}>
                    k8ordo
                  </span>
                  <span className="text-fg-subtle ml-auto shrink-0 text-xs">
                    {ls.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </DocSubsection>
        <DocSubsection id="line-height" title={t.lineHeightTitle}>
          <div className="border-border-mute bg-bg-surface rounded-xl border">
            <div className="flex flex-col gap-3 p-4">
              {LINE_HEIGHTS.map((lh) => (
                <div className="flex items-center gap-4" key={lh.name}>
                  <code className="text-fg-subtle w-20 shrink-0 text-sm">
                    {lh.name}
                  </code>
                  <div
                    className="flex-1 text-sm"
                    style={{ lineHeight: lh.value }}
                  >
                    The quick brown fox jumps over the lazy dog. The quick brown
                    fox jumps over the lazy dog.
                  </div>
                  <span className="text-fg-subtle shrink-0 text-xs">
                    {lh.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </DocSubsection>
      </DocSection>

      <DocSection id="radius" title={t.borderRadiusTitle}>
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-5 sm:gap-6">
          {RADII.map((radius) => (
            <div className="flex flex-col items-center gap-2" key={radius.name}>
              <div
                className="border-border-base bg-bg-subtle size-16 border-2"
                style={{ borderRadius: radius.value }}
              />
              <div className="flex flex-col items-center">
                <code className="text-sm font-medium">{radius.name}</code>
                <span className="text-fg-subtle text-xs">{radius.value}</span>
              </div>
            </div>
          ))}
        </div>
        <p>
          <Rich>{t.borderRadiusRoles()}</Rich>
        </p>
      </DocSection>

      <DocSection id="shadow" title={t.shadowTitle}>
        <div className="grid gap-4 sm:grid-cols-2">
          {SHADOWS.map((shadow) => (
            <div className="flex flex-col items-center gap-2" key={shadow.name}>
              <div
                className="border-border-mute bg-bg-base h-16 w-full rounded-lg border"
                style={{ boxShadow: shadow.value }}
              />
              <div className="flex flex-col items-center">
                <code className="text-sm font-medium">{shadow.name}</code>
                <span className="text-fg-subtle text-xs">{shadow.value}</span>
              </div>
            </div>
          ))}
        </div>
        <p>
          <Rich>{t.shadowUsage()}</Rich>
        </p>
      </DocSection>

      <DocSection id="spacing" title={t.spacingTitle}>
        <div className="border-border-mute bg-bg-surface rounded-xl border">
          <div className="flex flex-col gap-2 p-4">
            {SPACING_SCALE.map((space) => (
              <div className="flex items-center gap-3" key={space.step}>
                <code className="text-fg-subtle w-8 shrink-0 text-right text-sm">
                  {space.step}
                </code>
                <div
                  className="bg-primary-bg h-4 rounded-sm"
                  style={{ width: space.px }}
                />
                <span className="text-fg-subtle text-xs">
                  {space.rem} ({space.px})
                </span>
              </div>
            ))}
          </div>
        </div>
        <p>
          <Rich>{t.spacingUnit()}</Rich>
        </p>
      </DocSection>

      <DocSection id="breakpoints" title={t.breakpointsTitle}>
        <div className="border-border-mute bg-bg-surface rounded-xl border">
          <div className="flex flex-col gap-2 p-4">
            {BREAKPOINTS.map((bp) => (
              <div className="flex items-center gap-4" key={bp.name}>
                <code className="w-10 shrink-0 text-sm font-medium">
                  {bp.name}
                </code>
                <span className="text-fg-subtle text-xs">
                  ≥ {bp.px} ({bp.rem})
                </span>
              </div>
            ))}
          </div>
        </div>
        <p>
          <Rich>{t.breakpointsUsage()}</Rich>
        </p>
      </DocSection>

      <DocSection id="z-index" title={t.zIndexTitle}>
        <div className="border-border-mute bg-bg-surface rounded-xl border">
          <div className="flex flex-col gap-2 p-4">
            {Z_INDICES.map((z) => (
              <div className="flex items-center gap-4" key={z.name}>
                <code className="w-24 shrink-0 text-sm font-medium">
                  z-{z.name}
                </code>
                <span className="text-fg-mute flex-1 text-sm">
                  {Z_INDEX_USAGE[z.name as keyof typeof Z_INDEX_USAGE]}
                </span>
                <span className="text-fg-subtle shrink-0 text-xs">
                  {z.value}
                </span>
              </div>
            ))}
          </div>
        </div>
        <p>
          <Rich>{t.zIndexTopLayer()}</Rich>
        </p>
        <p>
          <Rich>{t.zIndexToast()}</Rich>
        </p>
      </DocSection>

      <DocSection id="dark-mode" title={t.darkModeTitle}>
        <CodeBlock code={DARK} lang="ts" />
        <p>
          <Rich>{t.darkModeClass()}</Rich>
        </p>
        <p>
          <Rich>{t.darkModeColorScheme()}</Rich>
        </p>
        <p>
          <Rich>{t.darkModeLibraryBefore()}</Rich>
          <LocaleAnchor path="/:locale/color-scheme">
            @k8ordo/color-scheme
          </LocaleAnchor>
          <Rich>{t.darkModeLibraryAfter()}</Rich>
        </p>
      </DocSection>

      <DocSection id="high-contrast" title={t.highContrastTitle}>
        <CodeBlock code={CONTRAST} lang="ts" title="toggle-button.tsx" />
        <p>
          <Rich>{t.highContrastOwnUi()}</Rich>
        </p>
        <p>
          <Rich>{t.highContrastStylesheet()}</Rich>
        </p>
        <Pitfall>
          <p>
            <Rich>{t.highContrastAvoid()}</Rich>
          </p>
        </Pitfall>
      </DocSection>
    </DocPage>
  );
}
