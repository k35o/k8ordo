import { runGuards } from './guard';
import { responseHeaders, withRequest } from './request-scope';

const context = {
  request: new Request('https://example.test/admin/7'),
  params: { id: '7' },
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
    expect(answer?.status).toBe(401);
    expect(ran).toStrictEqual(['outer']);
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
      /returns a Response to end the request, or nothing/u,
    );
  });
});
