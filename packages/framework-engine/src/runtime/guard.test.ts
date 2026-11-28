import { notFound } from '@k8ordo/router';
import { describe, expect, it } from 'vite-plus/test';

import { SAID_NOT_FOUND } from './ended';
import { runGuards } from './guard';
import { redirect } from './redirect';
import {
  answer as answered,
  cookies,
  responseHeaders,
  withRequest,
} from './request-scope';

const context = {
  request: new Request('https://example.test/admin/7'),
  params: { id: '7' },
};

const responseOf = (answer: unknown): Response => {
  if (!(answer instanceof Response)) {
    throw new TypeError(`the guards ended with ${String(answer)}`);
  }
  return answer;
};

describe('runGuards', () => {
  it('lets the request through when no guard answers', async () => {
    const ran: string[] = [];
    const answer = await runGuards(
      [
        () => {
          ran.push('outer');
        },
        async () => {
          await Promise.resolve();
          ran.push('inner');
        },
      ],
      context,
    );
    expect(answer).toBeNull();
    expect(ran).toStrictEqual(['outer', 'inner']);
  });

  it('ends at the first guard that answers, leaving the inner ones unrun', async () => {
    const ran: string[] = [];
    const answer = await runGuards(
      [
        () => {
          ran.push('outer');
          return new Response('sign in first', { status: 401 });
        },
        () => {
          ran.push('inner');
        },
      ],
      context,
    );
    expect(responseOf(answer).status).toBe(401);
    expect(ran).toStrictEqual(['outer']);
  });

  it('ends with a 303 to the URL redirect() names, carrying the cookies the guard wrote first', async () => {
    const ran: string[] = [];
    const response = await withRequest(context.request, async () =>
      answered(
        responseOf(
          await runGuards(
            [
              () => {
                cookies().delete('session');
                redirect('/login?next=%2Fadmin%2F7');
              },
              () => {
                ran.push('inner');
              },
            ],
            context,
          ),
        ),
      ),
    );
    expect(response.status).toBe(303);
    expect(response.headers.get('location')).toBe('/login?next=%2Fadmin%2F7');
    expect(response.headers.get('set-cookie')).toMatch(/^session=;/u);
    expect(ran).toStrictEqual([]);
  });

  it('ends with the not-found when a guard says notFound()', async () => {
    await expect(
      runGuards(
        [
          async () => {
            await Promise.resolve();
            notFound();
          },
        ],
        context,
      ),
    ).resolves.toBe(SAID_NOT_FOUND);
  });

  it('throws on what a guard threw that ends nothing', async () => {
    await expect(
      runGuards(
        [
          () => {
            throw new Error('the session store is down');
          },
        ],
        context,
      ),
    ).rejects.toThrow('the session store is down');
  });

  it('hands each guard the request and the params', async () => {
    let seen: unknown;
    await runGuards(
      [
        (received) => {
          seen = received;
        },
      ],
      context,
    );
    expect(seen).toBe(context);
  });

  it('lets a guard write to the response', async () => {
    await withRequest(context.request, () =>
      runGuards(
        [
          () => {
            expect(() => responseHeaders()).not.toThrow();
          },
        ],
        context,
      ),
    );
  });

  it('refuses a guard that returns something other than a Response', async () => {
    await expect(runGuards([() => '/login'], context)).rejects.toThrow(
      'a guard.ts ends the request with redirect() or notFound(), or by returning a Response, and returns nothing to let it through',
    );
  });
});
