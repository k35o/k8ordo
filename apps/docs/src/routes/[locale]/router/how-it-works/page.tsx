import type { Message } from '@k8ordo/i18n';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.routerHowItWorks;

const HOST = `'use client';

import {
  NavigationGeneration,
  PathnameProvider,
  useInterceptedNavigation,
} from '@k8ordo/router';
import { useDeferredValue, useState } from 'react';
import type { ReactNode } from 'react';

type Props = { initial: ReactNode; pathname: string };

export function ArticleHost({ initial, pathname }: Props) {
  const [latest, setLatest] = useState(initial);
  const { generation } = useInterceptedNavigation<ReactNode>({
    claim: (url) => url.pathname.startsWith('/articles/'),
    load: (url, signal) => loadArticle(url, signal),
    apply: setLatest,
  });
  const shown = useDeferredValue(latest);

  return (
    <PathnameProvider pathname={pathname}>
      <NavigationGeneration value={generation}>
        {shown}
      </NavigationGeneration>
    </PathnameProvider>
  );
}`;

const List = ({ items }: { items: readonly Message[] }) => (
  <ul>
    {items.map((item) => (
      <li key={item()}>
        <Rich>{item()}</Rich>
      </li>
    ))}
  </ul>
);

export default function RouterHowItWorksPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/router/how-it-works">
      <DocSection
        description={t.claimDescription}
        id="claim"
        title={t.claimTitle}
      >
        <p>
          <Rich>{t.claimNever()}</Rich>
        </p>
        <List
          items={[t.claimReload, t.claimPost, t.claimDownload, t.claimFragment]}
        />
        <p>
          <Rich>{t.claimWhy()}</Rich>
        </p>
        <p>
          <Rich>{t.claimGet()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.finishedDescription}
        id="finished"
        title={t.finishedTitle}
      >
        <p>
          <Rich>{t.finishedPaint()}</Rich>
        </p>
        <p>
          <Rich>{t.finishedLazy()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.stateDescription}
        id="state"
        title={t.stateTitle}
      >
        <p>
          <Rich>{t.stateKeep()}</Rich>
        </p>
        <p>
          <Rich>{t.stateShown()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.backgroundDescription}
        id="background"
        title={t.backgroundTitle}
      >
        <p>
          <Rich>{t.backgroundWhy()}</Rich>
        </p>
        <p>
          <Rich>{t.backgroundTypes()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.scrollDescription}
        id="scroll"
        title={t.scrollTitle}
      >
        <p>
          <Rich>{t.scrollFragment()}</Rich>
        </p>
        <p>
          <Rich>{t.scrollTraverse()}</Rich>
        </p>
        <p>
          <Rich>{t.scrollFocus()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.abortDescription}
        id="abort"
        title={t.abortTitle}
      >
        <p>
          <Rich>{t.abortRejects()}</Rich>
        </p>
        <p>
          <Rich>{t.abortLazy()}</Rich>
        </p>
      </DocSection>

      <DocSection description={t.hookDescription} id="hook" title={t.hookTitle}>
        <p>
          <Rich>{t.hookHandler()}</Rich>
        </p>
        <List items={[t.hookClaim, t.hookLoad, t.hookApply, t.hookRefresh]} />
        <CodeBlock
          code={HOST}
          lang="tsx"
          marks={{ 15: 'highlight', 20: 'highlight' }}
          title="src/article-host.tsx"
        />
        <p>
          <Rich>{t.hookDeferred()}</Rich>
        </p>
        <p>
          <Rich>{t.hookGeneration()}</Rich>
        </p>
        <p>
          <Rich>{t.hookRefreshDetail()}</Rich>
        </p>
        <Note>
          <p>
            <Rich>{t.hookWho()}</Rich>
          </p>
        </Note>
      </DocSection>
    </DocPage>
  );
}
