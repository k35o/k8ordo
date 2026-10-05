import { CodeBlock } from '@k8ordo/ui/code-block';

import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.colorSchemeStyling;

const UI_CSS = `@import '@k8ordo/ui/tailwind.css';`;

const UI_MARKUP = `<img alt="k8ordo" className="dark:invert" src="/logo.svg" />`;

const TAILWIND_CSS = `@import 'tailwindcss';

@custom-variant dark (&:where(.dark, .dark *));`;

const PLAIN_CSS = `:root {
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

const PROPERTY = `:root {
  color-scheme: light dark;
  color-scheme: light;
}

.dark {
  color-scheme: dark;
}`;

const CONTRAST = `@media (prefers-contrast: more) {
  :root {
    --page-fg: #000000;
  }

  :root.dark {
    --page-fg: #ffffff;
  }
}`;

export default function ColorSchemeStylingPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/color-scheme/styling">
      <DocSection
        description={t.classDescription}
        id="class"
        title={t.classTitle}
      >
        <p>
          <Rich>{t.classTiming()}</Rich>
        </p>
      </DocSection>

      <DocSection description={t.uiDescription} id="ui" title={t.uiTitle}>
        <CodeBlock code={UI_CSS} lang="css" title="globals.css" />
        <p>
          <Rich>{t.uiBoth()}</Rich>
        </p>
        <p>
          <Rich>{t.uiVariants()}</Rich>
        </p>
        <CodeBlock code={UI_MARKUP} lang="tsx" title="logo.tsx" />
      </DocSection>

      <DocSection
        description={t.tailwindDescription}
        id="tailwind"
        title={t.tailwindTitle}
      >
        <CodeBlock
          code={TAILWIND_CSS}
          lang="css"
          marks={{ 3: 'add' }}
          title="globals.css"
        />
        <p>
          <Rich>{t.tailwindSame()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.plainDescription}
        id="plain"
        title={t.plainTitle}
      >
        <CodeBlock
          code={PLAIN_CSS}
          lang="css"
          marks={{ 7: 'highlight' }}
          title="globals.css"
        />
        <p>
          <Rich>{t.plainSelector()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.propertyDescription}
        id="property"
        title={t.propertyTitle}
      >
        <p>
          <Rich>{t.propertyUi()}</Rich>
        </p>
        <CodeBlock
          code={PROPERTY}
          lang="css"
          marks={{ 2: 'remove', 3: 'add', 6: 'add', 7: 'add', 8: 'add' }}
          title="globals.css"
        />
        <p>
          <Rich>{t.propertyWhy()}</Rich>
        </p>
        <p>
          <Rich>{t.propertyLightDark()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.contrastDescription}
        id="contrast"
        title={t.contrastTitle}
      >
        <p>
          <Rich>{t.contrastUi()}</Rich>
        </p>
        <p>
          <Rich>{t.contrastOwn()}</Rich>
        </p>
        <CodeBlock code={CONTRAST} lang="css" title="globals.css" />
        <p>
          <LocaleAnchor path="/:locale/ui/theming">
            {t.contrastLink()}
          </LocaleAnchor>
        </p>
      </DocSection>
    </DocPage>
  );
}
