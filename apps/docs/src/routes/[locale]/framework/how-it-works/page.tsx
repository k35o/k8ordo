import type { Message } from '@k8ordo/i18n';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.frameworkHowItWorks;

const SHAPE = `mode: 'static'
  vite build → handler(/products/1)           → index.html
             → handler(/products/1/index.rsc) → index.rsc

mode: 'server'
  request    → handler(request)               → Response`;

const PAYLOAD = `/products/1            → HTML
/products/1/index.rsc  → RSC payload`;

const REFUSAL = `static build cannot run guard.ts — a file has no request to guard, and these are guards:
  src/routes/admin/guard.ts
this application wants mode: 'server'`;

const Items = ({ items }: { items: readonly Message[] }) => (
  <ul>
    {items.map((item) => (
      <li key={item()}>
        <Rich>{item()}</Rich>
      </li>
    ))}
  </ul>
);

export default function FrameworkHowItWorksPage() {
  return (
    <DocPage
      introduction={t.introduction}
      path="/:locale/framework/how-it-works"
    >
      <DocSection id="mode" title={t.modeTitle}>
        <p>
          <Rich>{t.modeDependency()}</Rich>
        </p>
        <p>
          <Rich>{t.modeSame()}</Rich>
        </p>
      </DocSection>

      <DocSection id="handler" title={t.handlerTitle}>
        <CodeBlock code={SHAPE} lang="text" />
        <p>
          <Rich>{t.handlerBuild()}</Rich>
        </p>
        <p>
          <Rich>{t.handlerModes()}</Rich>
        </p>
        <p>
          <Rich>{t.handlerDev()}</Rich>
          <LocaleAnchor path="/:locale/framework/troubleshooting">
            {m.framework.navTroubleshooting()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
      </DocSection>

      <DocSection id="payload" title={t.payloadTitle}>
        <CodeBlock code={PAYLOAD} lang="text" />
        <p>
          <Rich>{t.payloadPath()}</Rich>
        </p>
        <p>
          <Rich>{t.payloadEmbed()}</Rich>
        </p>
      </DocSection>

      <DocSection id="static-refuses" title={t.staticTitle}>
        <CodeBlock code={REFUSAL} lang="text" title="vite build" />
        <p>
          <Rich>{t.staticNoRequest()}</Rich>
        </p>
        <p>
          <Rich>{t.staticWhen()}</Rich>
        </p>
        <p>
          <Rich>{t.staticWants()}</Rich>
          <LocaleAnchor path="/:locale/framework/modes">
            {m.framework.navModes()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
      </DocSection>

      <DocSection id="server-refuses" title={t.serverTitle}>
        <p>
          <Rich>{t.serverAnywhere()}</Rich>
        </p>
        <Items items={t.serverList} />
      </DocSection>

      <DocSection id="both" title={t.bothTitle}>
        <p>
          <Rich>{t.bothIntro()}</Rich>
        </p>
        <Items items={t.bothList} />
      </DocSection>
    </DocPage>
  );
}
