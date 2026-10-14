import { Pitfall } from '../../../../components/callout';
import { CodeBlock } from '../../../../components/code-block';
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

import page from '../../../../styles/page.module.css';
import styles from '../../../../styles/pages/ui/theming.module.css';

const t = m.theming;

const DARK = `document.documentElement.classList.add('dark');`;

const CONTRAST = `.button[aria-pressed='true'] {
  background-color: var(--color-primary-bg-emphasize);

  @media (forced-colors: active) {
    background-color: var(--color-system-highlight);
    color: var(--color-system-highlight-text);
  }
}`;

const OVERRIDE = `:root {
  --color-primary-fg: var(--purple-800);
  --color-primary-bg: var(--purple-200);
  --color-primary-bg-subtle: var(--purple-50);
  --color-primary-bg-mute: var(--purple-100);
  --color-primary-bg-emphasize: var(--purple-300);
  --color-primary-border: var(--purple-500);
}

.dark {
  --color-primary-fg: var(--purple-300);
  --color-primary-bg: var(--purple-800);
  --color-primary-bg-subtle: var(--purple-950);
  --color-primary-bg-mute: var(--purple-900);
  --color-primary-bg-emphasize: var(--purple-700);
  --color-primary-border: var(--purple-500);
}`;

const OVERRIDE_VALUE = `:root {
  --color-primary-border: oklch(0.55 0.15 300);
}`;

const Z_INDEX_USAGE = {
  raised: 'Autocomplete, Combobox, RangeSlider',
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
          <div className={styles.tokens}>
            {FG_TOKENS.map((token) => (
              <TokenCard key={token.name} token={token} />
            ))}
          </div>
        </DocSubsection>
        <DocSubsection id="background" title={t.backgroundTitle}>
          <div className={styles.tokens}>
            {BG_TOKENS.map((token) => (
              <TokenCard key={token.name} token={token} />
            ))}
          </div>
        </DocSubsection>
        <DocSubsection id="border" title={t.borderTitle}>
          <div className={styles.tokens}>
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
          <div className={styles.tokens}>
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
          <div className={styles.tokens}>
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
          <div className={styles.tokens}>
            {GROUP_TOKENS.map((token) => (
              <TokenCard key={token.name} token={token} />
            ))}
          </div>
        </DocSubsection>
      </DocSection>

      <DocSection id="palette" title={t.colorPaletteTitle}>
        <div className={page.stack}>
          {PALETTE.map((family) => (
            <div className={styles.family} key={family.prefix}>
              <span className={styles.name}>{family.name}</span>
              <div className={styles.shades}>
                {SHADES.map((shade) => (
                  <div
                    className={styles.shade}
                    key={shade}
                    title={family.shades[shade]}
                  >
                    <div
                      className={styles.swatch}
                      style={{ backgroundColor: family.shades[shade] }}
                    />
                    <span className={styles.shadeName}>{shade}</span>
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
          <div className={styles.panel}>
            <div className={styles.samples}>
              {TEXT_SIZES.map((size) => {
                const ratio = lineHeightToNumber(size.lineHeight);
                return (
                  <div className={styles.baselineRow} key={size.name}>
                    <code className={styles.tokenName}>{size.name}</code>
                    {/* min-w-0 がないと flex item の min-width:auto により
                        text-highlight(6rem) の見本幅がページ全体を押し広げる */}
                    <span
                      className={styles.sizeSample}
                      style={{ fontSize: size.fontSize, lineHeight: ratio }}
                    >
                      k8ordo
                    </span>
                    <span className={styles.endValue}>
                      {size.fontSize} / {Number(ratio.toFixed(3))}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </DocSubsection>
        <DocSubsection id="font-weights" title={t.fontWeightsTitle}>
          <div className={styles.panel}>
            <div className={styles.samples}>
              {FONT_WEIGHTS.map((weight) => (
                <div className={styles.baselineRow} key={weight.name}>
                  <code className={styles.tokenName}>{weight.name}</code>
                  <span
                    className={styles.sample}
                    style={{ fontWeight: weight.value }}
                  >
                    k8ordo
                  </span>
                  <span className={styles.endValue}>{weight.value}</span>
                </div>
              ))}
            </div>
          </div>
          <p>
            <Rich>{t.fontWeightsNote()}</Rich>
          </p>
        </DocSubsection>
        <DocSubsection id="letter-spacing" title={t.letterSpacingTitle}>
          <div className={styles.panel}>
            <div className={styles.samples}>
              {LETTER_SPACINGS.map((ls) => (
                <div className={styles.baselineRow} key={ls.name}>
                  <code className={styles.tokenName}>{ls.name}</code>
                  <span
                    className={styles.sample}
                    style={{ letterSpacing: ls.value }}
                  >
                    k8ordo
                  </span>
                  <span className={styles.endValue}>{ls.value}</span>
                </div>
              ))}
            </div>
          </div>
        </DocSubsection>
        <DocSubsection id="line-height" title={t.lineHeightTitle}>
          <div className={styles.panel}>
            <div className={styles.samples}>
              {LINE_HEIGHTS.map((lh) => (
                <div className={styles.row} key={lh.name}>
                  <code className={styles.tokenName}>{lh.name}</code>
                  <div
                    className={styles.paragraph}
                    style={{ lineHeight: lh.value }}
                  >
                    The quick brown fox jumps over the lazy dog. The quick brown
                    fox jumps over the lazy dog.
                  </div>
                  <span className={styles.value}>{lh.value}</span>
                </div>
              ))}
            </div>
          </div>
        </DocSubsection>
      </DocSection>

      <DocSection id="radius" title={t.borderRadiusTitle}>
        <div className={styles.radii}>
          {RADII.map((radius) => (
            <div className={styles.specimen} key={radius.name}>
              <div
                className={styles.radiusBox}
                style={{ borderRadius: radius.value }}
              />
              <div className={styles.caption}>
                <code className={styles.name}>{radius.name}</code>
                <span className={styles.meta}>{radius.value}</span>
              </div>
            </div>
          ))}
        </div>
        <p>
          <Rich>{t.borderRadiusRoles()}</Rich>
        </p>
      </DocSection>

      <DocSection id="shadow" title={t.shadowTitle}>
        <div className={styles.shadows}>
          {SHADOWS.map((shadow) => (
            <div className={styles.specimen} key={shadow.name}>
              <div
                className={styles.shadowBox}
                style={{ boxShadow: shadow.value }}
              />
              <div className={styles.caption}>
                <code className={styles.name}>{shadow.name}</code>
                <span className={styles.meta}>{shadow.value}</span>
              </div>
            </div>
          ))}
        </div>
        <p>
          <Rich>{t.shadowUsage()}</Rich>
        </p>
      </DocSection>

      <DocSection id="spacing" title={t.spacingTitle}>
        <div className={styles.panel}>
          <div className={styles.entries}>
            {SPACING_SCALE.map((space) => (
              <div className={styles.spacingRow} key={space.step}>
                <code className={styles.step}>{space.step}</code>
                <div className={styles.bar} style={{ width: space.px }} />
                <span className={styles.meta}>
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
        <div className={styles.panel}>
          <div className={styles.entries}>
            {BREAKPOINTS.map((bp) => (
              <div className={styles.row} key={bp.name}>
                <code className={styles.breakpointName}>{bp.name}</code>
                <span className={styles.meta}>
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
        <div className={styles.panel}>
          <div className={styles.entries}>
            {Z_INDICES.map((z) => (
              <div className={styles.row} key={z.name}>
                <code className={styles.zIndexName}>z-{z.name}</code>
                <span className={styles.usage}>
                  {Z_INDEX_USAGE[z.name as keyof typeof Z_INDEX_USAGE]}
                </span>
                <span className={styles.value}>{z.value}</span>
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
        <CodeBlock
          code={CONTRAST}
          lang="css"
          title="toggle-button.module.css"
        />
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
