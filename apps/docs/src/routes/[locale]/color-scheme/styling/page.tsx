import { CodeBlock } from '@k8ordo/ui/code-block';

import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.colorSchemeStyling;

const UI_CSS = `/* src/styles/globals.css */
@import '@k8ordo/ui/tailwind.css';`;

const UI_MARKUP = `// src/components/logo.tsx
export function Logo() {
  return (
    <div className="bg-bg-base text-fg-base rounded-md p-4">
      <img alt="k8ordo" className="dark:invert" src="/logo.svg" />
    </div>
  );
}`;

const UI_PROPERTY = `/* @k8ordo/ui's base layer */
:root {
  color-scheme: light;
}

.dark {
  color-scheme: dark;
}`;

const TAILWIND_CSS = `/* src/styles/globals.css */
@import 'tailwindcss';

@custom-variant dark (&:where(.dark, .dark *));`;

const PLAIN_CSS = `/* src/styles/globals.css */
:root {
  color-scheme: light;
  --page-bg: #ffffff;
  --page-fg: #1f1f1f;
}

:root.dark {
  color-scheme: dark;
  --page-bg: #1f1f1f;
  --page-fg: #f5f5f5;
}

body {
  background: var(--page-bg);
  color: var(--page-fg);
}`;

export default function ColorSchemeStylingPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/color-scheme/styling">
      <DocSection
        description={t.classSection.description}
        title={t.classSection.title}
      />

      <DocSection description={t.ui.description} title={t.ui.title}>
        <CodeBlock code={UI_CSS} lang="css" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{t.ui.variants()}</Rich>
        </p>
        <CodeBlock code={UI_MARKUP} lang="tsx" />
      </DocSection>

      <DocSection description={t.property.description} title={t.property.title}>
        <CodeBlock code={UI_PROPERTY} lang="css" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{t.property.why()}</Rich>
        </p>
      </DocSection>

      <DocSection description={t.contrast.description} title={t.contrast.title}>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{t.contrast.ui()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{t.contrast.combined()}</Rich>
        </p>
        <p className="text-sm">
          <LocaleAnchor path="/:locale/ui/theming">
            <Rich>{t.contrast.link()}</Rich>
          </LocaleAnchor>
        </p>
      </DocSection>

      <DocSection description={t.tailwind.description} title={t.tailwind.title}>
        <CodeBlock code={TAILWIND_CSS} lang="css" />
      </DocSection>

      <DocSection description={t.plain.description} title={t.plain.title}>
        <CodeBlock code={PLAIN_CSS} lang="css" />
      </DocSection>
    </DocPage>
  );
}
