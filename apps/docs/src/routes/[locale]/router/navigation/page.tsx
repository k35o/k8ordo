import type { Message } from '@k8ordo/i18n';
import { Anchor, Code, Heading, Table } from '@k8ordo/ui';
import type { ReactNode } from 'react';

import { CodeBlock } from '../../../../components/code-block';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const LOCALE_SHELL_URL =
  'https://github.com/k35o/k8ordo/blob/main/apps/docs/src/routes/%5Blocale%5D/_parts/locale-shell.tsx';

const CROSS_FADE = `// src/root-layout.tsx
import { href, Outlet } from '@k8ordo/router';
import { ViewTransition } from 'react';

export function RootLayout() {
  return (
    <>
      <nav>
        <a href={href('/')}>Home</a>
        <a href={href('/products')}>Products</a>
      </nav>
      <ViewTransition
        default="none"
        update={{ navigation: 'auto', default: 'none' }}
      >
        <Outlet />
      </ViewTransition>
    </>
  );
}`;

const DIRECTIONAL = `// src/page-transition.tsx
import { Outlet } from '@k8ordo/router';
import { ViewTransition } from 'react';

export function PageTransition() {
  return (
    <ViewTransition
      default="none"
      update={{
        'navigation-push': 'slide-forward',
        'navigation-replace': 'slide-forward',
        'navigation-traverse': 'slide-back',
        default: 'none',
      }}
    >
      <Outlet />
    </ViewTransition>
  );
}`;

const DIRECTIONAL_CSS = `@keyframes slide-in-from-right {
  from {
    opacity: 0;
    translate: 32px 0;
  }
}

@keyframes slide-out-to-left {
  to {
    opacity: 0;
    translate: -32px 0;
  }
}

@keyframes slide-in-from-left {
  from {
    opacity: 0;
    translate: -32px 0;
  }
}

@keyframes slide-out-to-right {
  to {
    opacity: 0;
    translate: 32px 0;
  }
}

::view-transition-old(.slide-forward) {
  animation: 200ms ease-in both slide-out-to-left;
}

::view-transition-new(.slide-forward) {
  animation: 200ms ease-out both slide-in-from-right;
}

::view-transition-old(.slide-back) {
  animation: 200ms ease-in both slide-out-to-right;
}

::view-transition-new(.slide-back) {
  animation: 200ms ease-out both slide-in-from-left;
}`;

const REDUCED_MOTION = `@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation: none;
  }
}`;

const PRIMITIVE = `// src/article-host.tsx
'use client';

import {
  NavigationGeneration,
  PathnameProvider,
  useInterceptedNavigation,
} from '@k8ordo/router';
import { useDeferredValue, useState } from 'react';

type Article = { title: string; body: string };

const loadArticle = async (url: URL, signal: AbortSignal) => {
  const response = await fetch(\`/api\${url.pathname}.json\`, { signal });
  return (await response.json()) as Article;
};

export function ArticleHost({
  initial,
  pathname,
}: {
  initial: Article;
  pathname: string;
}) {
  const [latest, setLatest] = useState(initial);
  const { generation } = useInterceptedNavigation<Article>({
    claim: (url) => url.pathname.startsWith('/articles/'),
    load: loadArticle,
    apply: setLatest,
  });
  const article = useDeferredValue(latest);
  return (
    <PathnameProvider pathname={pathname}>
      <NavigationGeneration value={generation}>
        <article>
          <h1>{article.title}</h1>
          <p>{article.body}</p>
        </article>
      </NavigationGeneration>
    </PathnameProvider>
  );
}`;

const TEST_PURE = `// src/routes.test.ts
import { expect, it } from 'vitest';

import { routes } from './routes';

it('matches a product page before the catch-all', () => {
  expect(routes.match('/products/42')).toMatchObject({
    pattern: '/products/:id',
    params: { id: '42' },
  });
  expect(routes.match('/no/such/page')?.pattern).toBe('/*');
});`;

const TEST_BROWSER = `// src/app.browser.test.tsx
import { navigateTo, Router } from '@k8ordo/router';
import { afterEach, beforeEach, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { routes } from './routes';

const interceptEverything = (event: NavigateEvent) => {
  if (event.canIntercept) event.intercept();
};

let runnerUrl: string;

beforeEach(() => {
  runnerUrl = location.href;
});

afterEach(async () => {
  navigation.addEventListener('navigate', interceptEverything);
  try {
    await navigation.navigate(runnerUrl, { history: 'replace' }).finished;
  } finally {
    navigation.removeEventListener('navigate', interceptEverything);
  }
});

it('shows the product page once finished resolves', async () => {
  await render(<Router routes={routes} />);

  await navigateTo('/products/:id', { id: '1' }).finished;

  expect(document.querySelector('h1')?.textContent).toBe('Product 1');
});`;

const CLAIM_ROWS: ReadonlyArray<{ navigation: Message; handling: Message }> = [
  {
    navigation: m.routerNavigation.claimTable.pageChange,
    handling: m.routerNavigation.claimTable.pageChangeHandling,
  },
  {
    navigation: m.routerNavigation.claimTable.stateChange,
    handling: m.routerNavigation.claimTable.stateChangeHandling,
  },
  {
    navigation: m.routerNavigation.claimTable.unclaimed,
    handling: m.routerNavigation.claimTable.unclaimedHandling,
  },
  {
    navigation: m.routerNavigation.claimTable.reload,
    handling: m.routerNavigation.claimTable.neverOurs,
  },
  {
    navigation: m.routerNavigation.claimTable.post,
    handling: m.routerNavigation.claimTable.neverOurs,
  },
  {
    navigation: m.routerNavigation.claimTable.download,
    handling: m.routerNavigation.claimTable.neverOurs,
  },
  {
    navigation: m.routerNavigation.claimTable.fragment,
    handling: m.routerNavigation.claimTable.neverOurs,
  },
  {
    navigation: m.routerNavigation.claimTable.cannotIntercept,
    handling: m.routerNavigation.claimTable.neverOurs,
  },
];

const HISTORY_ROWS: ReadonlyArray<{ type: string; when: Message }> = [
  { type: 'navigation-push', when: m.routerNavigation.historyTable.push },
  { type: 'navigation-replace', when: m.routerNavigation.historyTable.replace },
  {
    type: 'navigation-traverse',
    when: m.routerNavigation.historyTable.traverse,
  },
];

const TIMELINE: readonly Message[] = [
  m.routerNavigation.timelineClaim,
  m.routerNavigation.timelineCommit,
  m.routerNavigation.timelineApply,
  m.routerNavigation.timelineLayoutEffect,
  m.routerNavigation.timelineFinished,
];

const HANDLER: readonly Message[] = [
  m.routerNavigation.handlerClaim,
  m.routerNavigation.handlerLoad,
  m.routerNavigation.handlerApply,
];

function Guarantee({
  title,
  children,
}: {
  title: Message;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Heading level="h3">
        <Rich>{title()}</Rich>
      </Heading>
      {children}
    </div>
  );
}

export default function RouterNavigationPage() {
  return (
    <DocPage
      introduction={m.routerNavigation.introduction}
      path="/:locale/router/navigation"
    >
      <DocSection
        description={m.routerNavigation.claimDescription}
        title={m.routerNavigation.claimTitle}
      >
        <Table.Root>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>
                {m.routerNavigation.claimTable.navigation()}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {m.routerNavigation.claimTable.handling()}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {CLAIM_ROWS.map((row) => (
              <Table.Row key={row.navigation()}>
                <Table.Cell>
                  <Rich>{row.navigation()}</Rich>
                </Table.Cell>
                <Table.Cell color="mute">
                  <Rich>{row.handling()}</Rich>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerNavigation.claimWhy()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerNavigation.claimMount()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={m.routerNavigation.timelineDescription}
        title={m.routerNavigation.timelineTitle}
      >
        <ol className="text-fg-mute flex flex-col gap-2 pl-6">
          {TIMELINE.map((step) => (
            <li className="list-decimal" key={step()}>
              <Rich>{step()}</Rich>
            </li>
          ))}
        </ol>
      </DocSection>

      <DocSection
        description={m.routerNavigation.guaranteesDescription}
        title={m.routerNavigation.guaranteesTitle}
      >
        <Guarantee title={m.routerNavigation.finishedTitle}>
          <p className="text-fg-mute leading-relaxed">
            <Rich>{m.routerNavigation.finishedDescription()}</Rich>
          </p>
          <p className="text-fg-mute leading-relaxed">
            <Rich>{m.routerNavigation.finishedInAction()}</Rich>{' '}
            <LocaleAnchor path="/:locale/router/links">
              {m.router.navLinks()}
            </LocaleAnchor>
          </p>
        </Guarantee>
        <Guarantee title={m.routerNavigation.stateTitle}>
          <p className="text-fg-mute leading-relaxed">
            <Rich>{m.routerNavigation.stateDescription()}</Rich>
          </p>
          <p className="text-fg-mute leading-relaxed">
            <Rich>{m.routerNavigation.stateShown()}</Rich>
          </p>
        </Guarantee>
        <Guarantee title={m.routerNavigation.scrollTitle}>
          <p className="text-fg-mute leading-relaxed">
            <Rich>{m.routerNavigation.scrollDescription()}</Rich>
          </p>
          <p className="text-fg-mute leading-relaxed">
            <Rich>{m.routerNavigation.scrollTraverse()}</Rich>
          </p>
        </Guarantee>
        <Guarantee title={m.routerNavigation.transitionTitle}>
          <p className="text-fg-mute leading-relaxed">
            <Rich>{m.routerNavigation.transitionDescription()}</Rich>
          </p>
        </Guarantee>
        <Guarantee title={m.routerNavigation.abortTitle}>
          <p className="text-fg-mute leading-relaxed">
            <Rich>{m.routerNavigation.abortDescription()}</Rich>
          </p>
        </Guarantee>
      </DocSection>

      <DocSection
        description={m.routerNavigation.historyDescription}
        title={m.routerNavigation.historyTitle}
      >
        <Table.Root>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>
                {m.routerNavigation.historyTable.type()}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {m.routerNavigation.historyTable.when()}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {HISTORY_ROWS.map((row) => (
              <Table.Row key={row.type}>
                <Table.Cell>
                  <Code>{row.type}</Code>
                </Table.Cell>
                <Table.Cell color="mute">
                  <Rich>{row.when()}</Rich>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerNavigation.historyEntryState()}</Rich>{' '}
          <LocaleAnchor path="/:locale/state/places">
            @k8ordo/state
          </LocaleAnchor>
        </p>
      </DocSection>

      <DocSection
        description={m.routerNavigation.animateDescription}
        title={m.routerNavigation.animateTitle}
      >
        <CodeBlock code={CROSS_FADE} lang="tsx" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerNavigation.animateWhy()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerNavigation.animateThisSite()}</Rich>{' '}
          <Anchor href={LOCALE_SHELL_URL} openInNewTab>
            locale-shell.tsx
          </Anchor>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerNavigation.animateDirection()}</Rich>
        </p>
        <CodeBlock code={DIRECTIONAL} lang="tsx" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerNavigation.animateDirectionCss()}</Rich>
        </p>
        <CodeBlock code={DIRECTIONAL_CSS} lang="css" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerNavigation.animateStateChange()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerNavigation.animateReducedMotion()}</Rich>
        </p>
        <CodeBlock code={REDUCED_MOTION} lang="css" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerNavigation.animateFramework()}</Rich>{' '}
          <LocaleAnchor path="/:locale/router/framework">
            {m.router.navFramework()}
          </LocaleAnchor>
        </p>
      </DocSection>

      <DocSection
        description={m.routerNavigation.primitiveDescription}
        title={m.routerNavigation.primitiveTitle}
      >
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerNavigation.primitiveHandler()}</Rich>
        </p>
        <ul className="text-fg-mute flex flex-col gap-2 pl-6">
          {HANDLER.map((item) => (
            <li className="list-disc" key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ul>
        <CodeBlock code={PRIMITIVE} lang="tsx" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerNavigation.primitiveEventTime()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerNavigation.primitiveRouter()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerNavigation.primitiveGeneration()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={m.routerNavigation.testingDescription}
        title={m.routerNavigation.testingTitle}
      >
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerNavigation.testingPure()}</Rich>
        </p>
        <CodeBlock code={TEST_PURE} lang="ts" />
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerNavigation.testingRender()}</Rich>
        </p>
        <p className="text-fg-mute leading-relaxed">
          <Rich>{m.routerNavigation.testingIntercept()}</Rich>
        </p>
        <CodeBlock code={TEST_BROWSER} lang="tsx" />
      </DocSection>
    </DocPage>
  );
}
