import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { InstallCommand, Requirements } from '../../../../components/install';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.frameworkGetStarted;

const CONFIG = `import { framework } from '@k8ordo/framework/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [framework({ mode: 'static' })],
});`;

const TSCONFIG = `{
  "include": [
    // ...
    ".k8ordo/**/*.ts"
  ]
}`;

const LAYOUT = `import type { LayoutProps } from '@k8ordo/framework';

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`;

const PAGE = `export default function HomePage() {
  return (
    <>
      <title>Home</title>
      <h1>Hello</h1>
    </>
  );
}`;

const RUN = `vite dev
vite build`;

const LOG = 'k8ordo: wrote 1 routes';

export default function FrameworkGetStartedPage() {
  return (
    <DocPage
      introduction={t.introduction}
      path="/:locale/framework/get-started"
    >
      <DocSection id="install" title={t.installTitle}>
        <InstallCommand packages="react react-dom server-only" />
        <InstallCommand packages="-D @k8ordo/framework @k8ordo/router vite typescript @types/node @types/react @types/react-dom" />
        <Requirements name="@k8ordo/framework" />
        <p>
          <Rich>{m.install.agentDocs('@k8ordo/framework')}</Rich>
        </p>
      </DocSection>

      <DocSection id="config" title={t.configTitle}>
        <CodeBlock
          callouts={{ 5: t.configModeCallout() }}
          code={CONFIG}
          lang="ts"
          marks={{ 1: 'highlight', 5: 'highlight' }}
          title="vite.config.ts"
        />
        <p>
          <Rich>{t.configPlugins()}</Rich>
        </p>
        <p>
          <Rich>{t.configMode()}</Rich>
          <LocaleAnchor path="/:locale/framework/modes">
            {m.framework.navModes()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
      </DocSection>

      <DocSection id="tsconfig" title={t.tsconfigTitle}>
        <CodeBlock
          code={TSCONFIG}
          lang="json"
          marks={{ 4: 'highlight' }}
          title="tsconfig.json"
        />
        <p>
          <Rich>{t.tsconfigTypes()}</Rich>
        </p>
      </DocSection>

      <DocSection id="layout" title={t.layoutTitle}>
        <CodeBlock code={LAYOUT} lang="tsx" title="src/routes/layout.tsx" />
        <p>
          <Rich>{t.layoutDocument()}</Rich>
        </p>
        <Note>
          <p>
            <Rich>{t.layoutHydration()}</Rich>
            <LocaleAnchor path="/:locale/framework/troubleshooting">
              {m.framework.navTroubleshooting()}
            </LocaleAnchor>
            <Rich>{t.see()}</Rich>
          </p>
        </Note>
      </DocSection>

      <DocSection id="page" title={t.pageTitle}>
        <CodeBlock code={PAGE} lang="tsx" title="src/routes/page.tsx" />
        <p>
          <Rich>{t.pageUrl()}</Rich>
        </p>
        <p>
          <Rich>{t.pageTitleTag()}</Rich>
        </p>
        <p>
          <Rich>{t.pageMore()}</Rich>
          <LocaleAnchor path="/:locale/framework/routing">
            {m.framework.navRouting()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
      </DocSection>

      <DocSection id="run" title={t.runTitle}>
        <CodeBlock code={RUN} lang="bash" />
        <CodeBlock code={LOG} lang="text" title="vite build" />
        <p>
          <Rich>{t.runDev()}</Rich>
        </p>
        <p>
          <Rich>{t.runBuild()}</Rich>
        </p>
        <p>
          <Rich>{t.runMore()}</Rich>
          <LocaleAnchor path="/:locale/framework/deploy">
            {m.framework.navDeploy()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
      </DocSection>
    </DocPage>
  );
}
