import { Card, Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../components/code-block';
import { T } from '../components/t';
import { TokenCard } from '../components/token-card';
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
} from '../theme/design-tokens';

const Z_INDEX_USAGE = {
  overlay: 'Popover, DropdownMenu, ListBox, Tooltip',
  modal: 'Modal, Drawer',
  toast: 'Toast',
} as const;

export function Theming() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <div className="flex flex-col gap-4">
        <Heading level="h1">
          <T k="nav.theming" />
        </Heading>
        <p className="text-fg-mute text-lg">
          <T k="theming.introduction" />
        </p>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="theming.colorPaletteTitle" />
        </Heading>
        <p className="text-fg-mute">
          <T k="theming.colorPaletteDescription" />
        </p>
        <div className="flex flex-col gap-4">
          {PALETTE.map((family) => (
            <div className="flex flex-col gap-1" key={family.prefix}>
              <span className="text-sm font-medium">{family.name}</span>
              <div className="grid grid-cols-5 gap-2 sm:grid-cols-11">
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
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <T k="theming.semanticColorsTitle" />
          </Heading>
          <p className="text-fg-mute">
            <T k="theming.semanticColorsDescription" />
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Heading level="h3">
            <T k="theming.foregroundTitle" />
          </Heading>
          <div className="grid gap-2 sm:grid-cols-2">
            {FG_TOKENS.map((token) => (
              <TokenCard key={token.name} token={token} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Heading level="h3">
            <T k="theming.backgroundTitle" />
          </Heading>
          <div className="grid gap-2 sm:grid-cols-2">
            {BG_TOKENS.map((token) => (
              <TokenCard key={token.name} token={token} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Heading level="h3">
            <T k="theming.borderTitle" />
          </Heading>
          <div className="grid gap-2 sm:grid-cols-2">
            {BORDER_TOKENS.map((token) => (
              <TokenCard key={token.name} token={token} type="border" />
            ))}
          </div>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <T k="theming.brandColorsTitle" />
          </Heading>
          <p className="text-fg-mute">
            <T k="theming.brandColorsDescription" />
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Heading level="h3">Primary</Heading>
          <div className="grid gap-2 sm:grid-cols-2">
            {PRIMARY_TOKENS.map((token) => (
              <TokenCard
                key={token.name}
                token={token}
                type={token.name.includes('border') ? 'border' : 'fill'}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Heading level="h3">Secondary</Heading>
          <div className="grid gap-2 sm:grid-cols-2">
            {SECONDARY_TOKENS.map((token) => (
              <TokenCard
                key={token.name}
                token={token}
                type={token.name.includes('border') ? 'border' : 'fill'}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Heading level="h3">Group</Heading>
          <div className="grid gap-2 sm:grid-cols-2">
            {GROUP_TOKENS.map((token) => (
              <TokenCard key={token.name} token={token} />
            ))}
          </div>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <T k="theming.typographyTitle" />
          </Heading>
          <p className="text-fg-mute">
            <T k="theming.typographyDescription" />
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Heading level="h3">
            <T k="theming.textSizesTitle" />
          </Heading>
          <Card>
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
          </Card>
        </div>

        <div className="flex flex-col gap-3">
          <Heading level="h3">
            <T k="theming.fontWeightsTitle" />
          </Heading>
          <Card>
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
          </Card>
        </div>

        <div className="flex flex-col gap-3">
          <Heading level="h3">
            <T k="theming.letterSpacingTitle" />
          </Heading>
          <Card>
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
          </Card>
        </div>

        <div className="flex flex-col gap-3">
          <Heading level="h3">
            <T k="theming.lineHeightTitle" />
          </Heading>
          <Card>
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
          </Card>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="theming.borderRadiusTitle" />
        </Heading>
        <p className="text-fg-mute">
          <T k="theming.borderRadiusDescription" />
        </p>
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
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="theming.shadowTitle" />
        </Heading>
        <p className="text-fg-mute">
          <T k="theming.shadowDescription" />
        </p>
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
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="theming.spacingTitle" />
        </Heading>
        <p className="text-fg-mute">
          <T k="theming.spacingDescription" />
        </p>
        <Card>
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
        </Card>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="theming.breakpointsTitle" />
        </Heading>
        <p className="text-fg-mute">
          <T k="theming.breakpointsDescription" />
        </p>
        <Card>
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
        </Card>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="theming.zIndexTitle" />
        </Heading>
        <p className="text-fg-mute">
          <T k="theming.zIndexDescription" />
        </p>
        <Card>
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
        </Card>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="theming.darkModeTitle" />
        </Heading>
        <p className="text-fg-mute">
          <T k="theming.darkModeDescription" />
        </p>
        <CodeBlock
          code={`// Enable dark mode
document.documentElement.classList.add('dark');

// Disable dark mode
document.documentElement.classList.remove('dark');`}
          lang="ts"
        />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="theming.customizeTitle" />
        </Heading>
        <p className="text-fg-mute">
          <T k="theming.customizeDescription" />
        </p>
        <CodeBlock
          code={`/* app.css — import after the k8ordo UI stylesheet */
:root {
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
}`}
          lang="css"
        />
        <p className="text-fg-mute">
          <T k="theming.customizeValueDescription" />
        </p>
        <CodeBlock
          code={`:root {
  --primary-border: oklch(0.55 0.15 300);
}`}
          lang="css"
        />
      </section>
    </div>
  );
}
