import { CodeBlock } from '@k8ordo/ui/code-block';

import { Pitfall } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.stateTesting;

const PURE = `import { expect, test } from 'vitest';

import { density, listState } from './state';

test('a page below 1 reads as the first page', () => {
  expect(listState.parseUrl({ page: '0' }).page).toBe(1);
});

test('a link leaves the defaults out', () => {
  expect(listState.href('/products', { page: 1 })).toBe('/products');
});

test('a compact cookie reads back as compact', () => {
  const cookies = new Map([
    [density.cookieName, density.cookieValue({ density: 'compact' })],
  ]);
  expect(density.parseCookies(cookies).density).toBe('compact');
});`;

const RESET = `import { resetStateRegistry } from '@k8ordo/state';
import { afterEach } from 'vitest';

import { density, prefs } from './state';

afterEach(async () => {
  resetStateRegistry();
  localStorage.removeItem(prefs.storageKey);
  await cookieStore.delete(density.cookieName);
});`;

const ROUTER = `const interceptAsRouter = (event: NavigateEvent) => {
  if (event.canIntercept) event.intercept();
};

let home: string;

beforeEach(() => {
  home = location.href;
  navigation.addEventListener('navigate', interceptAsRouter);
});

afterEach(async () => {
  await navigation.navigate(home, { history: 'replace' }).finished;
  navigation.removeEventListener('navigate', interceptAsRouter);
});`;

const STORAGE_EVENT = `localStorage.setItem(
  prefs.storageKey,
  JSON.stringify({ view: 'table', pageSize: 20 }),
);
window.dispatchEvent(
  new StorageEvent('storage', {
    key: prefs.storageKey,
    storageArea: localStorage,
  }),
);`;

const COOKIE_CHANGE = `await cookieStore.set(
  density.cookieName,
  encodeURIComponent(density.cookieValue({ density: 'compact' })),
);`;

export default function StateTestingPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/state/testing">
      <DocSection
        description={t.pureDescription}
        id="pure"
        title={t.pureTitle}
      >
        <CodeBlock code={PURE} lang="ts" title="state.test.ts" />
        <p>
          <Rich>{t.pureInput()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.browserDescription}
        id="browser"
        title={t.browserTitle}
      >
        <p>
          <Rich>{t.browserHttps()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.resetDescription}
        id="reset"
        title={t.resetTitle}
      >
        <CodeBlock code={RESET} lang="ts" marks={{ 7: 'highlight' }} />
        <p>
          <Rich>{t.resetRows()}</Rich>
        </p>
        <Pitfall>
          <p>
            <Rich>{t.resetUnmount()}</Rich>
          </p>
        </Pitfall>
      </DocSection>

      <DocSection
        description={t.routerDescription}
        id="router"
        title={t.routerTitle}
      >
        <CodeBlock code={ROUTER} lang="ts" marks={{ 2: 'highlight' }} />
        <p>
          <Rich>{t.routerHome()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.tabsDescription}
        id="tabs"
        title={t.tabsTitle}
      >
        <p>
          <Rich>{t.tabsStorage()}</Rich>
        </p>
        <CodeBlock code={STORAGE_EVENT} lang="ts" />
        <p>
          <Rich>{t.tabsCookie()}</Rich>
        </p>
        <CodeBlock code={COOKIE_CHANGE} lang="ts" />
      </DocSection>
    </DocPage>
  );
}
