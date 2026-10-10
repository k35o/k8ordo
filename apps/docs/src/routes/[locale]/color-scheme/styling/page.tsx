import { CodeBlock } from '@k8ordo/ui/code-block';

import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.colorSchemeStyling;

const HTML_CLASS = `<html class="dark">`;

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
      <DocSection id="class" title={t.classTitle}>
        <CodeBlock code={HTML_CLASS} lang="html" />
        <p>
          <Rich>{t.classWhen()}</Rich>
        </p>
        <p>
          <Rich>{t.classTiming()}</Rich>
        </p>
        <p>
          <Rich>{t.classUi()}</Rich>
          <LocaleAnchor path="/:locale/ui/theming">
            {t.uiThemingLink()}
          </LocaleAnchor>
          <Rich>{t.classUiAfter()}</Rich>
        </p>
      </DocSection>

      <DocSection id="tailwind" title={t.tailwindTitle}>
        <CodeBlock
          callouts={{ 3: t.tailwindCallout() }}
          code={TAILWIND_CSS}
          lang="css"
          marks={{ 3: 'add' }}
          title="globals.css"
        />
        <p>
          <Rich>{t.tailwindVariant()}</Rich>
        </p>
      </DocSection>

      <DocSection id="plain" title={t.plainTitle}>
        <CodeBlock
          callouts={{ 7: t.plainCallout() }}
          code={PLAIN_CSS}
          lang="css"
          marks={{ 7: 'highlight' }}
          title="globals.css"
        />
        <p>
          <Rich>{t.plainSelector()}</Rich>
        </p>
      </DocSection>

      <DocSection id="property" title={t.propertyTitle}>
        <CodeBlock
          code={PROPERTY}
          lang="css"
          marks={{ 2: 'remove', 3: 'add', 6: 'add', 7: 'add', 8: 'add' }}
          title="globals.css"
        />
        <p>
          <Rich>{t.propertyWhat()}</Rich>
        </p>
        <p>
          <Rich>{t.propertyWhy()}</Rich>
        </p>
        <p>
          <Rich>{t.propertyLightDark()}</Rich>
        </p>
      </DocSection>

      <DocSection id="contrast" title={t.contrastTitle}>
        <CodeBlock code={CONTRAST} lang="css" title="globals.css" />
        <p>
          <Rich>{t.contrastOwn()}</Rich>
        </p>
        <p>
          <Rich>{t.contrastUi()}</Rich>
          <LocaleAnchor path="/:locale/ui/theming">
            {t.uiThemingLink()}
          </LocaleAnchor>
          <Rich>{t.contrastAfter()}</Rich>
        </p>
      </DocSection>
    </DocPage>
  );
}
