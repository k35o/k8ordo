import type { Message } from '@k8ordo/i18n';
import { CodeBlock } from '@k8ordo/ui/code-block';

import * as m from '../../messages';
import { DocSection } from '../doc-page';
import { Rich } from '../rich';

const SHAPE = `@k8ordo/static
  vite build → handler(/products/1)           → index.html
             → handler(/products/1/index.rsc) → index.rsc

@k8ordo/server
  request    → handler(request)               → Response`;

const Items = ({ items }: { items: readonly Message[] }) => (
  <ul>
    {items.map((item) => (
      <li key={item()}>
        <Rich>{item()}</Rich>
      </li>
    ))}
  </ul>
);

/**
 * The page is the same under both modes: it is about what tells them apart.
 * A function rather than a component, so `DocPage` sees the sections it
 * returns and lists them in the contents.
 */
export const howItWorksSections = () => {
  const t = m.frameworkHowItWorks;
  return (
    <>
      <DocSection description={t.modeDescription} id="mode" title={t.modeTitle}>
        <p>
          <Rich>{t.modeWhy()}</Rich>
        </p>
        <p>
          <Rich>{t.modeSame()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.handlerDescription}
        id="handler"
        title={t.handlerTitle}
      >
        <CodeBlock code={SHAPE} lang="text" />
        <p>
          <Rich>{t.handlerStatic()}</Rich>
        </p>
        <p>
          <Rich>{t.handlerServer()}</Rich>
        </p>
        <p>
          <Rich>{t.handlerDev()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.payloadDescription}
        id="payload"
        title={t.payloadTitle}
      >
        <p>
          <Rich>{t.payloadPath()}</Rich>
        </p>
        <p>
          <Rich>{t.payloadEmbed()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.staticDescription}
        id="static-refuses"
        title={t.staticTitle}
      >
        <Items items={t.staticList} />
        <p>
          <Rich>{t.staticDev()}</Rich>
        </p>
        <p>
          <Rich>{t.staticWants()}</Rich>
        </p>
        <p>
          <Rich>{t.staticPaths()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.serverDescription}
        id="server-refuses"
        title={t.serverTitle}
      >
        <Items items={t.serverList} />
      </DocSection>

      <DocSection description={t.bothDescription} id="both" title={t.bothTitle}>
        <Items items={t.bothList} />
      </DocSection>
    </>
  );
};
