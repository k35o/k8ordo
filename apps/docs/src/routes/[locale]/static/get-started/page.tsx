import { CodeBlock } from '../../../../components/code-block';
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

const REFUSED = `static build cannot ship Server Actions — a file cannot receive one, and these declare 'use server':
  src/routes/_parts/guestbook.ts
this application wants @k8ordo/server`;

const RUN = `vite dev
vite build`;

const LOG = `k8ordo: wrote 1 routes`;

export default function StaticGetStartedPage() {
  const t = m.staticGetStarted;
  return (
    <DocPage introduction={t.introduction} path="/:locale/static/get-started">
      <DocSection description={t.modeDescription} title={t.modeTitle}>
        <Paragraph text={t.modeActions} />
        <CodeBlock code={REFUSED} lang="bash" />
        <Paragraph text={t.modeDev} />
        <Paragraph text={t.modeSame} />
      </DocSection>

      <DocSection description={t.installDescription} title={t.installTitle}>
        <InstallTabs
          npm={
            <CodeBlock
              code={`npm install @k8ordo/router react react-dom server-only
npm install -D @k8ordo/static vite`}
              lang="bash"
            />
          }
          pnpm={
            <CodeBlock
              code={`pnpm add @k8ordo/router react react-dom server-only
pnpm add -D @k8ordo/static vite`}
              lang="bash"
            />
          }
          yarn={
            <CodeBlock
              code={`yarn add @k8ordo/router react react-dom server-only
yarn add -D @k8ordo/static vite`}
              lang="bash"
            />
          }
        />
        <Paragraph text={t.requirementsDescription} />
        <Requirements />
      </DocSection>

      <SetupConfig description={t.configDescription} mode="static" />

      <SetupRoutes />

      <DocSection description={t.runDescription} title={t.runTitle}>
        <CodeBlock code={RUN} lang="bash" />
        <Paragraph text={t.runDev} />
        <Paragraph text={t.runLog} />
        <CodeBlock code={LOG} lang="bash" />
      </DocSection>

      <SetupGenerated mode="static" />

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
          <LocaleAnchor path="/:locale/server">@k8ordo/server</LocaleAnchor>
        </p>
      </DocSection>

      <DocSection title={t.nextTitle}>
        <Bullets>
          <Bullet>
            <LocaleAnchor path="/:locale/static/routing">
              <Rich>{t.nextRouting()}</Rich>
            </LocaleAnchor>
          </Bullet>
          <Bullet>
            <LocaleAnchor path="/:locale/static/params">
              <Rich>{t.nextParams()}</Rich>
            </LocaleAnchor>
          </Bullet>
          <Bullet>
            <LocaleAnchor path="/:locale/static/errors">
              <Rich>{t.nextErrors()}</Rich>
            </LocaleAnchor>
          </Bullet>
          <Bullet>
            <LocaleAnchor path="/:locale/static/boundaries">
              <Rich>{t.nextBoundaries()}</Rich>
            </LocaleAnchor>
          </Bullet>
          <Bullet>
            <LocaleAnchor path="/:locale/static/deploy">
              <Rich>{t.nextDeploy()}</Rich>
            </LocaleAnchor>
          </Bullet>
        </Bullets>
      </DocSection>
    </DocPage>
  );
}
