import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { renderHook } from 'vitest-browser-react';

import { useClient } from './index';

const Probe = () => createElement('span', null, String(useClient()));

describe('useClient', () => {
  it('クライアントではtrueを返す', async () => {
    const { result } = await renderHook(() => useClient());

    expect(result.current).toBe(true);
  });

  it('サーバーレンダリングではfalseを返す', () => {
    expect(renderToString(createElement(Probe))).toContain('false');
  });
});
