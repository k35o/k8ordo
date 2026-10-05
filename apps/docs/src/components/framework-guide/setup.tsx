import type { Message } from '@k8ordo/i18n';
import { CodeBlock } from '@k8ordo/ui/code-block';

import * as m from '../../messages';
import { DocSection } from '../doc-page';
import { LocaleAnchor } from '../locale-anchor';
import { PeerTable } from '../peer-table';
import { packageOf } from './mode';
import type { Mode } from './mode';
import { Bullet, Bullets, Paragraph, SubHeading } from './prose';

const TSCONFIG = `{
  "include": ["src/**/*.ts", "src/**/*.tsx", ".k8ordo/**/*.ts"]
}`;

const LAYOUT = `// src/routes/layout.tsx
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`;

const PAGE = `// src/routes/page.tsx
export default function HomePage() {
  return (
    <>
      <title>home</title>
      <h1>hello</h1>
    </>
  );
}`;

const config = (mode: Mode): string => `// vite.config.ts
import { framework } from '${packageOf(mode)}';
import { defineConfig } from 'vite';

export default defineConfig({ plugins: [framework()] });`;

/** The peers a mode package declares, and the Node.js it needs. */
export function Requirements({ mode }: { mode: Mode }) {
  const t = m.frameworkRouting.setup;
  return (
    <>
      <PeerTable
        name={packageOf(mode)}
        neededFor={{
          '@k8ordo/router': t.peerRouter,
          react: t.peerReact,
          'react-dom': t.peerReact,
          vite: t.peerVite,
        }}
      />
      <Bullets>
        <Bullet>Node.js &gt;= 24</Bullet>
      </Bullets>
    </>
  );
}

/** `vite.config.ts` and `tsconfig.json`, the same under either mode but for the import. */
export function SetupConfig({
  mode,
  description,
}: {
  mode: Mode;
  description: Message;
}) {
  const t = m.frameworkRouting;
  return (
    <DocSection
      id="config"
      description={description}
      title={t.setup.configTitle}
    >
      <CodeBlock code={config(mode)} lang="ts" />
      <Paragraph text={t.setup.pluginsNote} />
      <SubHeading text={t.setup.tsconfigTitle} />
      <Paragraph text={t.generatedTsconfig} />
      <CodeBlock code={TSCONFIG} lang="json" />
    </DocSection>
  );
}

/** The smallest `routes/`: the document and one page. */
export function SetupRoutes() {
  const t = m.frameworkRouting.setup;
  return (
    <DocSection
      id="routes"
      description={t.routesDescription}
      title={t.routesTitle}
    >
      <CodeBlock code={LAYOUT} lang="tsx" />
      <CodeBlock code={PAGE} lang="tsx" />
      <SubHeading text={t.documentTitle} />
      <Paragraph text={t.documentDescription} />
    </DocSection>
  );
}

/** What the first dev or build writes, pointing on to the mode's routing page. */
export function SetupGenerated({ mode }: { mode: Mode }) {
  const t = m.frameworkRouting;
  return (
    <DocSection
      id="generated"
      description={t.setup.generatedDescription}
      title={t.setup.generatedTitle}
    >
      <Paragraph text={t.generatedTypecheck} />
      <Paragraph text={t.setup.generatedMore}>
        {mode === 'static' ? (
          <LocaleAnchor path="/:locale/static/routing">
            {m.static.navRouting()}
          </LocaleAnchor>
        ) : (
          <LocaleAnchor path="/:locale/server/routing">
            {m.server.navRouting()}
          </LocaleAnchor>
        )}
      </Paragraph>
    </DocSection>
  );
}
