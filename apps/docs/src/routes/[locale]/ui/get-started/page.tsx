import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { PackageInstall, peerVersionOf } from '../../../../components/install';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.getStarted;

const STYLES = `import '@k8ordo/ui/styles.css';`;

const TAILWIND = `@import '@k8ordo/ui/tailwind.css';`;

const PROVIDER = `import { UIProvider } from '@k8ordo/ui';

export function Root() {
  return (
    <UIProvider>
      <App />
    </UIProvider>
  );
}`;

const COMPONENT = `import { Button, FormControl, TextField } from '@k8ordo/ui';

export function SubscribeForm() {
  return (
    <form>
      <FormControl
        label="Email"
        renderInput={(props) => <TextField {...props} type="email" />}
      />
      <Button type="submit" variant="solid">
        Subscribe
      </Button>
    </form>
  );
}`;

export default function UiGetStartedPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/ui/get-started">
      <DocSection id="install" title={t.installTitle}>
        <PackageInstall name="@k8ordo/ui" />
        <p>
          <Rich>{t.installAiBefore()}</Rich>
          <LocaleAnchor path="/:locale/ui/ai">{m.nav.ai()}</LocaleAnchor>
          <Rich>{t.installAiAfter()}</Rich>
        </p>
      </DocSection>

      <DocSection id="styles" title={t.stylesTitle}>
        <CodeBlock code={STYLES} lang="tsx" title="main.tsx" />
        <p>
          <Rich>{t.stylesEntry()}</Rich>
        </p>
        <CodeBlock code={TAILWIND} lang="css" title="app.css" />
        <p>
          <Rich>
            {t.stylesTailwind(peerVersionOf('@k8ordo/ui', 'tailwindcss'))}
          </Rich>
        </p>
        <p>
          <Rich>{t.stylesDarkBefore()}</Rich>
          <LocaleAnchor path="/:locale/ui/theming">
            {m.nav.theming()}
          </LocaleAnchor>
          <Rich>{t.stylesDarkAfter()}</Rich>
        </p>
        <Note>
          <p>
            <Rich>{t.stylesBase()}</Rich>
          </p>
          <p>
            <Rich>{t.stylesProseBefore()}</Rich>
            <LocaleAnchor path="/:locale/ui/components/prose">
              Prose
            </LocaleAnchor>
            <Rich>{t.stylesProseAfter()}</Rich>
          </p>
        </Note>
      </DocSection>

      <DocSection id="provider" title={t.providerTitle}>
        <CodeBlock code={PROVIDER} lang="tsx" title="main.tsx" />
        <p>
          <Rich>{t.providerRoot()}</Rich>
        </p>
        <p>
          <Rich>{t.providerWordingBefore()}</Rich>
          <LocaleAnchor path="/:locale/ui/i18n">{m.nav.i18n()}</LocaleAnchor>
          <Rich>{t.providerWordingAfter()}</Rich>
        </p>
      </DocSection>

      <DocSection id="component" title={t.componentTitle}>
        <CodeBlock code={COMPONENT} lang="tsx" title="subscribe-form.tsx" />
        <p>
          <Rich>{t.componentImport()}</Rich>
        </p>
        <p>
          <Rich>{t.componentProps()}</Rich>
        </p>
      </DocSection>
    </DocPage>
  );
}
