import { CodeBlock } from '@k8ordo/ui/code-block';

import { DocPage, DocSection } from '../../../../components/doc-page';
import {
  Bullet,
  Bullets,
  Paragraph,
} from '../../../../components/framework-guide/prose';
import {
  Requirements,
  SetupConfig,
  SetupGenerated,
  SetupRoutes,
} from '../../../../components/framework-guide/setup';
import { InstallTabs } from '../../../../components/install-tabs';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const RUN = `vite dev
vite build
node serve.js`;

const SERVE = `// serve.js
import { serve } from '@k8ordo/server/serve';

await serve({ port: 3000 });`;

export default function ServerGetStartedPage() {
  const t = m.serverGetStarted;
  return (
    <DocPage introduction={t.introduction} path="/:locale/server/get-started">
      <DocSection description={t.modeDescription} title={t.modeTitle}>
        <Paragraph text={t.modeSame} />
      </DocSection>

      <DocSection description={t.installDescription} title={t.installTitle}>
        <InstallTabs
          npm={
            <CodeBlock
              code={`npm install @k8ordo/router @k8ordo/server react react-dom server-only
npm install -D vite`}
              lang="bash"
            />
          }
          pnpm={
            <CodeBlock
              code={`pnpm add @k8ordo/router @k8ordo/server react react-dom server-only
pnpm add -D vite`}
              lang="bash"
            />
          }
          yarn={
            <CodeBlock
              code={`yarn add @k8ordo/router @k8ordo/server react react-dom server-only
yarn add -D vite`}
              lang="bash"
            />
          }
        />
        <Paragraph text={t.requirementsDescription} />
        <Requirements />
      </DocSection>

      <SetupConfig description={t.configDescription} mode="server" />

      <SetupRoutes />

      <DocSection description={t.runDescription} title={t.runTitle}>
        <CodeBlock code={SERVE} lang="ts" />
        <CodeBlock code={RUN} lang="bash" />
      </DocSection>

      <SetupGenerated mode="server" />

      <DocSection description={t.chooseDescription} title={t.chooseTitle}>
        <Bullets>
          <Bullet>
            <Rich>{t.chooseActions()}</Rich>
          </Bullet>
          <Bullet>
            <Rich>{t.chooseRequest()}</Rich>
          </Bullet>
          <Bullet>
            <Rich>{t.chooseStatus()}</Rich>
          </Bullet>
          <Bullet>
            <Rich>{t.chooseValues()}</Rich>
          </Bullet>
        </Bullets>
        <p>
          <LocaleAnchor path="/:locale/static">@k8ordo/static</LocaleAnchor>
        </p>
      </DocSection>

      <DocSection title={t.nextTitle}>
        <Bullets>
          <Bullet>
            <LocaleAnchor path="/:locale/server/routing">
              <Rich>{t.nextRouting()}</Rich>
            </LocaleAnchor>
          </Bullet>
          <Bullet>
            <LocaleAnchor path="/:locale/server/params">
              <Rich>{t.nextParams()}</Rich>
            </LocaleAnchor>
          </Bullet>
          <Bullet>
            <LocaleAnchor path="/:locale/server/errors">
              <Rich>{t.nextErrors()}</Rich>
            </LocaleAnchor>
          </Bullet>
          <Bullet>
            <LocaleAnchor path="/:locale/server/boundaries">
              <Rich>{t.nextBoundaries()}</Rich>
            </LocaleAnchor>
          </Bullet>
          <Bullet>
            <LocaleAnchor path="/:locale/server/actions">
              <Rich>{t.nextActions()}</Rich>
            </LocaleAnchor>
          </Bullet>
          <Bullet>
            <LocaleAnchor path="/:locale/server/deploy">
              <Rich>{t.nextDeploy()}</Rich>
            </LocaleAnchor>
          </Bullet>
        </Bullets>
      </DocSection>
    </DocPage>
  );
}
