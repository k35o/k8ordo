import type { Message } from '@k8ordo/i18n';
import { CodeBlock } from '@k8ordo/ui/code-block';

import type { SitePath } from '../../links';
import * as m from '../../messages';
import { Note, Pitfall } from '../callout';
import { DocSection } from '../doc-page';
import { Requirements } from '../install';
import { InstallTabs } from '../install-tabs';
import { LocaleAnchor } from '../locale-anchor';
import { Rich } from '../rich';
import { packageOf } from './mode';
import type { Mode } from './mode';

const DEPENDENCIES: Readonly<Record<Mode, { run: string; dev: string }>> = {
  static: {
    run: '@k8ordo/router react react-dom server-only',
    dev: '@k8ordo/static vite',
  },
  server: {
    run: '@k8ordo/router @k8ordo/server react react-dom server-only',
    dev: 'vite',
  },
};

const install = (mode: Mode, add: string, addDev: string): string =>
  `${add} ${DEPENDENCIES[mode].run}\n${addDev} ${DEPENDENCIES[mode].dev}`;

const config = (
  mode: Mode,
): string => `import { framework } from '${packageOf(mode)}';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [framework()],
});`;

const TSCONFIG = `{
  "include": ["src/**/*.ts", "src/**/*.tsx", ".k8ordo/**/*.ts"]
}`;

const LAYOUT = `import type { ReactNode } from 'react';

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
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

const STATIC_RUN = `vite dev
vite build`;

const STATIC_LOG = 'k8ordo: wrote 1 routes';

const SERVE = `import { serve } from '@k8ordo/server/serve';

await serve({ port: 3000 });`;

const SERVER_RUN = `vite dev
vite build
node serve.js`;

const ABOUT = `export default function AboutPage() {
  return (
    <>
      <title>About</title>
      <h1>About</h1>
    </>
  );
}`;

const HOME = `import { href } from '@k8ordo/router';

export default function HomePage() {
  return (
    <>
      <title>Home</title>
      <h1>Hello</h1>
      <a href={href('/about')}>About</a>
    </>
  );
}`;

type Step = { path: SitePath; label: Message; description: Message };

const NEXT: Readonly<Record<Mode, readonly Step[]>> = {
  static: [
    {
      path: '/:locale/static/routing',
      label: m.static.navRouting,
      description: m.staticGetStarted.nextRouting,
    },
    {
      path: '/:locale/static/params',
      label: m.static.navParams,
      description: m.staticGetStarted.nextParams,
    },
    {
      path: '/:locale/static/deploy',
      label: m.static.navDeploy,
      description: m.staticGetStarted.nextDeploy,
    },
  ],
  server: [
    {
      path: '/:locale/server/routing',
      label: m.server.navRouting,
      description: m.serverGetStarted.nextRouting,
    },
    {
      path: '/:locale/server/actions',
      label: m.server.navActions,
      description: m.serverGetStarted.nextActions,
    },
    {
      path: '/:locale/server/deploy',
      label: m.server.navDeploy,
      description: m.serverGetStarted.nextDeploy,
    },
  ],
};

const staticRun = () => {
  const t = m.staticGetStarted;
  return (
    <DocSection description={t.runDescription} id="run" title={t.runTitle}>
      <CodeBlock code={STATIC_RUN} lang="bash" />
      <p>
        <Rich>{t.runDev()}</Rich>
      </p>
      <p>
        <Rich>{t.runBuild()}</Rich>
      </p>
      <CodeBlock code={STATIC_LOG} lang="text" title="vite build" />
      <Note>
        <p>
          <Rich>{t.runDiffers()}</Rich>
        </p>
      </Note>
    </DocSection>
  );
};

const serverRun = () => {
  const t = m.serverGetStarted;
  return (
    <DocSection description={t.runDescription} id="run" title={t.runTitle}>
      <CodeBlock code={SERVE} lang="js" title="serve.js" />
      <CodeBlock code={SERVER_RUN} lang="bash" />
      <p>
        <Rich>{t.runDev()}</Rich>
      </p>
      <p>
        <Rich>{t.runServe()}</Rich>
      </p>
      <p>
        <Rich>{t.runProd()}</Rich>
      </p>
    </DocSection>
  );
};

/**
 * The tutorial both modes share, apart from what they install and how they
 * run. A function rather than a component, so `DocPage` sees the sections it
 * returns and lists them in the contents.
 */
export const getStartedSections = (mode: Mode) => {
  const t = m.frameworkGetStarted;
  const own = mode === 'static' ? m.staticGetStarted : m.serverGetStarted;
  return (
    <>
      <DocSection
        description={own.installDescription}
        id="install"
        title={t.installTitle}
      >
        <InstallTabs
          npm={
            <CodeBlock
              code={install(mode, 'npm install', 'npm install -D')}
              lang="bash"
            />
          }
          pnpm={
            <CodeBlock
              code={install(mode, 'pnpm add', 'pnpm add -D')}
              lang="bash"
            />
          }
          yarn={
            <CodeBlock
              code={install(mode, 'yarn add', 'yarn add -D')}
              lang="bash"
            />
          }
        />
        <p>
          <Rich>{t.serverOnly()}</Rich>
        </p>
        <Requirements name={packageOf(mode)} />
      </DocSection>

      <DocSection
        description={t.configDescription}
        id="config"
        title={t.configTitle}
      >
        <CodeBlock
          code={config(mode)}
          lang="ts"
          marks={{ 1: 'highlight', 5: 'highlight' }}
          title="vite.config.ts"
        />
        <p>
          <Rich>{t.configReact()}</Rich>
        </p>
        <p>
          <Rich>{t.configMode()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.tsconfigDescription}
        id="tsconfig"
        title={t.tsconfigTitle}
      >
        <CodeBlock
          code={TSCONFIG}
          lang="json"
          marks={{ 2: 'highlight' }}
          title="tsconfig.json"
        />
        <Pitfall>
          <p>
            <Rich>{t.tsconfigPitfall()}</Rich>
          </p>
        </Pitfall>
        <p>
          <Rich>{t.tsconfigGit()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.layoutDescription}
        id="layout"
        title={t.layoutTitle}
      >
        <CodeBlock code={LAYOUT} lang="tsx" title="src/routes/layout.tsx" />
        <p>
          <Rich>{t.layoutWhy()}</Rich>
        </p>
        <Note>
          <p>
            <Rich>{t.layoutHydration()}</Rich>
          </p>
          <p>
            {mode === 'static' ? (
              <LocaleAnchor path="/:locale/static/troubleshooting">
                {m.static.navTroubleshooting()}
              </LocaleAnchor>
            ) : (
              <LocaleAnchor path="/:locale/server/troubleshooting">
                {m.server.navTroubleshooting()}
              </LocaleAnchor>
            )}
          </p>
        </Note>
      </DocSection>

      <DocSection description={t.pageDescription} id="page" title={t.pageTitle}>
        <CodeBlock code={PAGE} lang="tsx" title="src/routes/page.tsx" />
        <p>
          <Rich>{t.pageServer()}</Rich>
        </p>
        <p>
          <Rich>{t.pageTitleTag()}</Rich>
        </p>
      </DocSection>

      {mode === 'static' ? staticRun() : serverRun()}

      <DocSection description={t.linkDescription} id="link" title={t.linkTitle}>
        <CodeBlock code={ABOUT} lang="tsx" title="src/routes/about/page.tsx" />
        <CodeBlock
          code={HOME}
          lang="tsx"
          marks={{ 1: 'add', 8: 'add' }}
          title="src/routes/page.tsx"
        />
        <p>
          <Rich>{t.linkHref()}</Rich>
        </p>
        <p>
          <Rich>{t.linkPlain()}</Rich>
        </p>
      </DocSection>

      <DocSection id="next" title={t.nextTitle}>
        <ul>
          {NEXT[mode].map((step) => (
            <li key={step.path}>
              <LocaleAnchor path={step.path}>{step.label()}</LocaleAnchor>
              {' — '}
              <Rich>{step.description()}</Rich>
            </li>
          ))}
        </ul>
      </DocSection>
    </>
  );
};
