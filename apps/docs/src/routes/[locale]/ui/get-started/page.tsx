import { Anchor } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { InstallTabs } from '../../../../components/install-tabs';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { PeerTable } from '../../../../components/peer-table';
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
        <InstallTabs
          npm={
            <CodeBlock code="npm install @k8ordo/ui @k8ordo/i18n" lang="bash" />
          }
          pnpm={
            <CodeBlock code="pnpm add @k8ordo/ui @k8ordo/i18n" lang="bash" />
          }
          yarn={
            <CodeBlock code="yarn add @k8ordo/ui @k8ordo/i18n" lang="bash" />
          }
        />
        <p>
          <Rich>{t.peersDescription()}</Rich>
        </p>
        <PeerTable
          name="@k8ordo/ui"
          neededFor={{
            react: t.peers.react,
            'react-dom': t.peers.reactDom,
            '@k8ordo/i18n': t.peers.i18n,
            typescript: t.peers.types,
            '@types/react': t.peers.types,
            '@types/react-dom': t.peers.types,
            tailwindcss: t.peers.tailwindcss,
            zod: t.peers.zod,
            '@json-render/core': t.peers.jsonRender,
            '@json-render/react': t.peers.jsonRender,
            '@openuidev/lang-core': t.peers.openuiLangCore,
            '@openuidev/react-lang': t.peers.openuiReactLang,
            ai: t.peers.ai,
            streamdown: t.peers.streamdown,
          }}
        />
      </DocSection>

      <DocSection
        description={t.stylesDescription}
        id="styles"
        title={t.stylesTitle}
      >
        <CodeBlock code={STYLES} lang="tsx" title="main.tsx" />
        <p>
          <Rich>{t.stylesTailwind()}</Rich>
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
