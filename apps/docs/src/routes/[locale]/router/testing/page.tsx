import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.routerTesting;

const MATCH = `import { expect, it } from 'vitest';

import { routes } from './routes';

it('sends /products/new to its own page', () => {
  const found = routes.match('/products/new');
  expect(found?.pattern).toBe('/products/new');
});

it('reads the id of a product page', () => {
  const found = routes.match('/products/42');
  expect(found?.params).toStrictEqual({ id: '42' });
});`;

const BROWSER = `import { navigateTo, Router } from '@k8ordo/router';
import { expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { routes } from './routes';

it('shows the product page once finished resolves', async () => {
  await render(<Router routes={routes} />);

  await navigateTo('/products/:id', { id: '1' }).finished;

  const heading = document.querySelector('h1');
  expect(heading?.textContent).toBe('Product 1');
});`;

const INTERCEPT = `const interceptEverything = (event: NavigateEvent) => {
  if (event.canIntercept) event.intercept();
};

const navigateOutside = async (url: string) => {
  navigation.addEventListener('navigate', interceptEverything);
  try {
    await navigation.navigate(url, { history: 'replace' }).finished;
  } finally {
    navigation.removeEventListener('navigate', interceptEverything);
  }
};

let home: string;

beforeEach(() => {
  home = location.href;
});

afterEach(async () => {
  await navigateOutside(home);
});`;

export default function RouterTestingPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/router/testing">
      <DocSection
        description={t.matchDescription}
        id="match"
        title={t.matchTitle}
      >
        <CodeBlock code={MATCH} lang="ts" title="src/routes.test.ts" />
        <p>
          <Rich>{t.matchPure()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.browserDescription}
        id="browser"
        title={t.browserTitle}
      >
        <CodeBlock
          code={BROWSER}
          lang="tsx"
          marks={{ 10: 'highlight' }}
          title="src/app.browser.test.tsx"
        />
        <p>
          <Rich>{t.browserFinished()}</Rich>
        </p>
        <p>
          <Rich>{t.browserEffects()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.interceptDescription}
        id="intercept"
        title={t.interceptTitle}
      >
        <p>
          <Rich>{t.interceptWhen()}</Rich>
        </p>
        <CodeBlock
          code={INTERCEPT}
          lang="ts"
          marks={{ 6: 'highlight', 10: 'highlight' }}
          title="src/app.browser.test.tsx"
        />
        <Note>
          <p>
            <Rich>{t.interceptRouter()}</Rich>
          </p>
        </Note>
      </DocSection>

      <DocSection
        description={t.traverseDescription}
        id="traverse"
        title={t.traverseTitle}
      >
        <p>
          <Rich>{t.traversePlaywright()}</Rich>
        </p>
      </DocSection>
    </DocPage>
  );
}
