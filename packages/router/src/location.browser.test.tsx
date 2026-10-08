import { Suspense } from 'react';
import type { FC, ReactNode } from 'react';
import { renderToReadableStream } from 'react-dom/server';
import { render } from 'vitest-browser-react';

import {
  appPathname,
  BrowserPathname,
  PathnameProvider,
  usePathname,
} from './location';

const Probe: FC = () => <span data-testid="pathname">{usePathname()}</span>;

const serverRender = async (
  node: ReactNode,
): Promise<{ html: string; errors: unknown[] }> => {
  const errors: unknown[] = [];
  const stream = await renderToReadableStream(node, {
    onError: (error) => {
      errors.push(error);
    },
  });
  await stream.allReady;
  return { html: await new Response(stream).text(), errors };
};

describe('BrowserPathname', () => {
  it('leaves a pathname read below it to the browser in a server render, and reports no error', async () => {
    const { html, errors } = await serverRender(
      <PathnameProvider pathname="/ja/posts/!fallback">
        <BrowserPathname>
          <Suspense fallback="waiting">
            <Probe />
          </Suspense>
        </BrowserPathname>
      </PathnameProvider>,
    );

    expect(html).toContain('waiting');
    expect(html).not.toContain('/ja/posts');
    expect(errors).toStrictEqual([]);
  });

  it('answers with the pathname the server rendered for outside it', async () => {
    const { html } = await serverRender(
      <PathnameProvider pathname="/ja/posts/!fallback">
        <Suspense fallback="waiting">
          <Probe />
        </Suspense>
      </PathnameProvider>,
    );

    expect(html).toContain('/ja/posts/!fallback');
    expect(html).not.toContain('waiting');
  });

  it('answers with where the browser is in a client render', async () => {
    const screen = await render(
      <PathnameProvider pathname="/ja/posts/!fallback">
        <BrowserPathname>
          <Suspense fallback="waiting">
            <Probe />
          </Suspense>
        </BrowserPathname>
      </PathnameProvider>,
    );

    await expect
      .element(screen.getByTestId('pathname'))
      .toHaveTextContent(appPathname());
  });
});
