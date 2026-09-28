import type { FC } from 'react';
import { createRoot } from 'react-dom/client';
import { z } from 'zod';

import { definePageState } from '../../src/page-state';
import { useAppState } from '../../src/use-app-state';

// state はナビゲーションを横取りするルーターを前提にする。いちばん小さい
// handler でルーターを演じる
navigation.addEventListener('navigate', (event) => {
  if (event.canIntercept) event.intercept();
});

const listState = definePageState('list', {
  url: z.object({ page: z.coerce.number().int().min(1).default(1) }),
});

const Pager: FC = () => {
  const [{ page }, update] = useAppState(listState, ['page']);
  return (
    <>
      <p data-testid="page">{page}</p>
      <button
        type="button"
        onClick={() => {
          update({ page: page + 1 }, { history: 'push' });
        }}
      >
        push next
      </button>
    </>
  );
};

const panelState = definePageState('panel', {
  url: z.object({ tab: z.enum(['a', 'b']).default('a') }),
  entry: z.object({ expanded: z.array(z.string()).default([]) }),
});

const Panel: FC = () => {
  const [{ tab, expanded }, update] = useAppState(panelState);
  return (
    <>
      <p data-testid="tab">{tab}</p>
      <p data-testid="expanded">{expanded.join(',')}</p>
      <button
        type="button"
        onClick={() => {
          update({ tab: 'b', expanded: ['y'] }, { history: 'push' });
        }}
      >
        tab and expand
      </button>
    </>
  );
};

const rootElement = document.querySelector('#root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <>
    <Pager />
    <Panel />
  </>,
);
