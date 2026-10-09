import { buildFixture } from '../../fixtures/build';
import type { BuiltFixture } from '../../fixtures/build';

const ORIGIN = 'https://k8ordo.test';

let built: BuiltFixture | undefined;
let server: BuiltFixture | undefined;

const answer = (pathname: string): Promise<Response> => {
  if (built === undefined) throw new Error('the fixture was not built');
  return built.handler(new Request(`${ORIGIN}${pathname}`));
};

const answerFromServer = (pathname: string): Promise<Response> => {
  if (server === undefined) throw new Error('the fixture was not built');
  return server.handler(new Request(`${ORIGIN}${pathname}`));
};

// 殻はビルドされたハンドラでしか描けないので、fallback.tsx を持つアプリを
// 両方のモードでビルドする。生成される表をモードごとに書き換えるので順に
beforeAll(async () => {
  built = await buildFixture('fallback', { mode: 'static' });
  server = await buildFixture('fallback', { mode: 'server' });
}, 240_000);

afterAll(async () => {
  await built?.dispose();
  await server?.dispose();
});

describe('a shell, under a build into files', () => {
  it('renders the layouts as HTML around the fallback.tsx, and leaves its URL reads to the browser', async () => {
    const response = await answer('/news/posts/!fallback');
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get('x-k8ordo-shell')).toBe('/:section/posts/:id');
    expect(html).toContain('<p>shell</p>');
    expect(html).toContain('<p>waiting</p>');
    expect(html).not.toContain('<p>page');
    expect(html).not.toContain('<p>at ');
    expect(html).toContain('data-section="news"');
    expect(html).toContain('data-keys="section"');
    expect(html).toContain('data-pathname="/news/posts/!fallback"');
  });

  it('carries the nearest not-found in its payload', async () => {
    const response = await answer('/news/posts/!fallback/index.rsc');
    const payload = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe(
      'text/x-component;charset=utf-8',
    );
    expect(response.headers.get('x-k8ordo-shell')).toBe('/:section/posts/:id');
    expect(payload).toContain('shell');
    expect(payload).toContain('nothing here');
  });

  it('passes over a not-found that would take what it leaves to the browser', async () => {
    const payload = await (
      await answer('/news/posts/!fallback/index.rsc')
    ).text();

    expect(payload).toContain('nothing here');
    expect(payload).not.toContain('no post');
  });

  it('leaves that not-found to the values the table answers with it', async () => {
    const response = await answer('/news/posts/7/missing');

    expect(response.status).toBe(404);
    expect(await response.text()).toContain('<h1>no post <!-- -->7</h1>');
  });

  it('is no shell where the reserved segment stands for a param a layout receives', async () => {
    const response = await answer('/!fallback/posts/!fallback');

    expect(response.status).toBe(404);
    expect(response.headers.has('x-k8ordo-shell')).toBe(false);
  });

  it('is refused, as a page is, by a layout’s schema over the params it fills', async () => {
    const response = await answer('/closed/posts/!fallback');

    expect(response.status).toBe(404);
    expect(response.headers.has('x-k8ordo-not-found')).toBe(false);
    expect(response.headers.has('x-k8ordo-shell')).toBe(false);
  });

  it('leaves a value to its page', async () => {
    const response = await answer('/news/posts/7');

    expect(response.status).toBe(200);
    expect(await response.text()).toContain('<p>page <!-- -->7</p>');
    expect(response.headers.has('x-k8ordo-shell')).toBe(false);
  });

  it('answers a notFound() said while it rendered as a page’s', async () => {
    const response = await answer('/news/gone/!fallback');

    expect(response.status).toBe(404);
    expect(response.headers.get('x-k8ordo-not-found')).toBe('page');
  });

  it('renders a fallback.tsx that is a client component', async () => {
    const response = await answer('/news/use-client/!fallback');

    expect(response.status).toBe(200);
    expect(response.headers.get('x-k8ordo-shell')).toBe(
      '/:section/use-client/:id',
    );
    expect(await response.text()).toContain('<p>client shell</p>');
  });

  it('says the handler was built for files', () => {
    expect(built?.mode).toBe('static');
  });
});

describe('the same application under a running server', () => {
  it('renders no shell: the reserved segment is a value its page’s schema refuses', async () => {
    const response = await answerFromServer('/news/posts/!fallback');

    expect(response.status).toBe(404);
    expect(response.headers.has('x-k8ordo-shell')).toBe(false);
    expect(server?.mode).toBe('server');
  });
});
