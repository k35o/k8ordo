import { cookies, withRequest } from './request-scope';
import { methodNotAllowed, methodsOf, routeAnswerFor, runRoute } from './route';

const get = () => new Response('feed', { headers: { 'x-kind': 'feed' } });
const post = () => new Response(null, { status: 201 });
const ownHead = () => new Response(null, { headers: { 'x-kind': 'own' } });
const setsCookie = () => {
  cookies().set('seen', '1');
  return new Response(null);
};

const context = (method: string) => ({
  request: new Request('https://example.test/feed.xml', { method }),
  params: {},
});

describe('a route.ts', () => {
  it('answers a method it exports', async () => {
    const found = routeAnswerFor({ GET: get }, 'GET');
    expect(found).not.toBeNull();
    const response = await runRoute(found!, context('GET'));
    expect(await response.text()).toBe('feed');
  });

  it('answers HEAD from its GET, with the headers and without the body', async () => {
    const found = routeAnswerFor({ GET: get }, 'HEAD');
    const response = await runRoute(found!, context('HEAD'));
    expect(response.headers.get('x-kind')).toBe('feed');
    expect(response.body).toBeNull();
  });

  it('prefers a HEAD of its own', async () => {
    const found = routeAnswerFor({ GET: get, HEAD: ownHead }, 'HEAD');
    const response = await runRoute(found!, context('HEAD'));
    expect(response.headers.get('x-kind')).toBe('own');
  });

  it('has nothing for a method it does not export, and names the ones it does', () => {
    expect(routeAnswerFor({ GET: get, POST: post }, 'DELETE')).toBeNull();
    expect(
      methodNotAllowed({ GET: get, POST: post, paramsSchema: {} }).headers.get(
        'allow',
      ),
    ).toBe('GET, HEAD, POST');
  });

  it('reads only functions as methods', () => {
    expect(methodsOf({ GET: 'not a handler', POST: post })).toStrictEqual([
      'POST',
    ]);
  });

  it('may write the response while it answers', async () => {
    await withRequest(context('POST').request, async () => {
      await expect(
        runRoute(
          routeAnswerFor({ POST: setsCookie }, 'POST')!,
          context('POST'),
        ),
      ).resolves.toBeInstanceOf(Response);
    });
  });

  it('refuses an answer that is not a Response', async () => {
    const found = routeAnswerFor({ GET: () => 'feed' }, 'GET');
    await expect(runRoute(found!, context('GET'))).rejects.toThrow(
      /answers with a Response/u,
    );
  });
});
