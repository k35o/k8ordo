import { Anchor } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { PackageInstall, peerVersionOf } from '../../../../components/install';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import { STORYBOOK_URL } from '../../../../constants';
import * as m from '../../../../messages';

const t = m.getStarted;

const STYLES = `import '@k8ordo/ui/styles.css';`;

const TAILWIND = `@import '@k8ordo/ui/tailwind.css';`;

const PROVIDER = `<UIProvider>
  <App />
</UIProvider>`;

const COMPONENT = `<FormControl
  label="Email"
  renderInput={(props) => <TextField {...props} type="email" />}
/>
<Button type="submit" variant="solid">
  Subscribe
</Button>`;

const NEXT = [
  {
    path: '/:locale/ui/components',
    label: m.nav.components,
    description: t.nextComponents,
  },
  {
    path: '/:locale/ui/theming',
    label: m.nav.theming,
    description: t.nextTheming,
  },
  {
    path: '/:locale/ui/i18n',
    label: m.nav.i18n,
    description: t.nextI18n,
  },
] as const;

export default function UiGetStartedPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/ui/get-started">
      <DocSection
        description={t.installDescription}
        id="install"
        title={t.installTitle}
      >
        <PackageInstall name="@k8ordo/ui" />
        <p>
          <Rich>{t.installFeatures()}</Rich>{' '}
          <LocaleAnchor path="/:locale/ui/ai">{m.nav.ai()}</LocaleAnchor>
        </p>
      </DocSection>

      <DocSection
        description={t.stylesDescription}
        id="styles"
        title={t.stylesTitle}
      >
        <CodeBlock code={STYLES} lang="tsx" title="main.tsx" />
        <p>
          <Rich>
            {t.stylesTailwind(peerVersionOf('@k8ordo/ui', 'tailwindcss'))}
          </Rich>
        </p>
        <CodeBlock code={TAILWIND} lang="css" title="app.css" />
        <Note>
          <p>
            <Rich>{t.stylesBase()}</Rich>
          </p>
        </Note>
      </DocSection>

      <DocSection
        description={t.providerDescription}
        id="provider"
        title={t.providerTitle}
      >
        <CodeBlock code={PROVIDER} lang="tsx" title="main.tsx" />
        <p>
          <Rich>{t.providerWording()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.componentDescription}
        id="component"
        title={t.componentTitle}
      >
        <CodeBlock code={COMPONENT} lang="tsx" title="subscribe-form.tsx" />
        <p>
          <Rich>{t.componentProps()}</Rich>
        </p>
      </DocSection>

      <DocSection description={t.darkDescription} id="dark" title={t.darkTitle}>
        <p>
          <Rich>{t.darkColorScheme()}</Rich>{' '}
          <LocaleAnchor path="/:locale/color-scheme">
            @k8ordo/color-scheme
          </LocaleAnchor>
        </p>
      </DocSection>

      <DocSection
        description={t.wordingDescription}
        id="wording"
        title={t.wordingTitle}
      />

      <DocSection id="next" title={t.nextTitle}>
        <ul>
          {NEXT.map((step) => (
            <li key={step.path}>
              <LocaleAnchor path={step.path}>{step.label()}</LocaleAnchor>
              {m.docPage.termSeparator()}
              <Rich>{step.description()}</Rich>
            </li>
          ))}
          <li>
            <Anchor href={STORYBOOK_URL} openInNewTab>
              Storybook
            </Anchor>
            {m.docPage.termSeparator()}
            <Rich>{t.nextStorybook()}</Rich>
          </li>
        </ul>
      </DocSection>
    </DocPage>
  );
}
