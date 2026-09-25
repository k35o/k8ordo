import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

type Handler = (request: Request) => Promise<Response>;

// 属性値の中で React がエスケープした文字を戻す。useActionState が仕込む
// hidden input の値は JSON なので、&quot; を戻さないと action が復号できない
const unescapeAttribute = (value: string): string =>
  value
    .replaceAll('&quot;', '"')
    .replaceAll('&#x27;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&');

// SSR した HTML の中の <form> を、ブラウザが送るのと同じ FormData にする
const formDataOf = (html: string, testId: string): FormData => {
  const form =
    new RegExp(`<form[^>]*data-testid="${testId}"[\\s\\S]*?</form>`, 'u').exec(
      html,
    )?.[0] ?? '';
  const body = new FormData();
  for (const input of form.matchAll(/<input[^>]*>/gu)) {
    const name = /name="([^"]+)"/u.exec(input[0])?.[1];
    const value = /value="([^"]*)"/u.exec(input[0])?.[1] ?? '';
    if (name !== undefined) body.set(name, unescapeAttribute(value));
  }
  return body;
};

// ページの entries リストだけを切り出す
const entriesOf = (html: string): string =>
  /<ul[^>]*data-testid="entries"[\s\S]*?<\/ul>/u.exec(html)?.[0] ?? '';

// pnpm install --prod で入れたアプリには、ビルドにしか使わない vite も
// @vitejs/* も無い。子プロセスでそれらの解決を拒んだうえで、serve に 1 枚返させる
const WITHOUT_BUILD_TOOLING = `
import { registerHooks } from 'node:module';

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (
      specifier === 'vite' ||
      specifier.startsWith('vite/') ||
      specifier.startsWith('@vitejs/')
    ) {
      throw new Error('the deployed application resolved ' + specifier);
    }
    return nextResolve(specifier, context);
  },
});

const { serve } = await import('@k8ordo/server/runtime');
const server = await serve({ port: 0 });
try {
  const response = await fetch(server.url);
  process.stdout.write(String(response.status) + '\\n' + (await response.text()));
} finally {
  await server.close();
}
`;

const root = path.resolve(import.meta.dirname, '..');
const ORIGIN = 'https://example.test';
let handler: Handler;

// ビルドは global-setup.ts が済ませている。組み上がったハンドラは
// @k8ordo/static が事前描画で呼ぶのと同じ関数でもある
beforeAll(async () => {
  const entry = pathToFileURL(path.join(root, 'dist', 'rsc', 'index.js')).href;
  ({ default: handler } = (await import(entry)) as { default: Handler });
});

describe('the built request handler', () => {
  it('answers a page with HTML the server rendered', async () => {
    const response = await handler(new Request(`${ORIGIN}/`));
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/html');
    expect(await response.text()).toContain('rendered on the server');
  });

  it('answers the same page as a payload for a client navigation', async () => {
    const response = await handler(new Request(`${ORIGIN}/products/index.rsc`));
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/x-component');
    expect(await response.text()).toContain('first product');
  });

  it('reads the parameter out of the request, with no list of values', async () => {
    const html = await (
      await handler(new Request(`${ORIGIN}/products/2`))
    ).text();
    expect(html).toContain('second product');
    // [id] のスキーマが通した値で、page は number を受け取る
    expect(html).toContain('number:2');
  });

  it('answers a parameter the schema refuses as a URL it does not have', async () => {
    const response = await handler(new Request(`${ORIGIN}/products/shoes`));
    expect(response.status).toBe(404);
    expect(await response.text()).toContain('not found');
  });

  it('answers a URL it does not have with the not-found page, under a real 404', async () => {
    const response = await handler(new Request(`${ORIGIN}/nowhere`));
    expect(response.status).toBe(404);
    expect(await response.text()).toContain('not found');
  });

  it('keeps the layout and leaves a page that throws to error.tsx in the browser', async () => {
    const response = await handler(new Request(`${ORIGIN}/broken`));
    const html = await response.text();
    expect(response.status).toBe(200);
    // layout は生き残り、失敗した部分木は Suspense がブラウザに委ねる印になる
    expect(html).toContain('<nav>');
    expect(html).toContain('<!--$!-->');
  });

  it.each([
    ['a page', '/', 200, 'text/html'],
    ['a URL it does not have', '/nowhere', 404, 'text/html'],
    ['a payload', '/products/index.rsc', 200, 'text/x-component'],
  ])(
    'answers HEAD for %s with the status and type a GET gets, and no body',
    async (_what, pathname, status, type) => {
      const response = await handler(
        new Request(`${ORIGIN}${pathname}`, { method: 'HEAD' }),
      );
      expect(response.status).toBe(status);
      expect(response.headers.get('content-type')).toContain(type);
      expect(response.body).toBeNull();
    },
  );

  it.each(['PUT', 'DELETE', 'PATCH', 'OPTIONS'])(
    'answers %s with a 405 naming the methods it takes',
    async (method) => {
      const response = await handler(new Request(`${ORIGIN}/`, { method }));
      expect(response.status).toBe(405);
      expect(response.headers.get('allow')).toBe('GET, HEAD, POST');
    },
  );

  it('answers a redirect.ts with the status and location it declares', async () => {
    const response = await handler(new Request(`${ORIGIN}/old`));
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('/products');
  });

  it('answers a form posted without JavaScript whose action redirected with a 303', async () => {
    // SSR した HTML の hidden input が action を名指す。それをそのまま POST する
    const html = await (await handler(new Request(`${ORIGIN}/`))).text();
    const body = formDataOf(html, 'leave-form');
    expect([...body.keys()].some((key) => key.startsWith('$ACTION'))).toBe(
      true,
    );
    const response = await handler(
      new Request(`${ORIGIN}/`, {
        method: 'POST',
        headers: { origin: ORIGIN },
        body,
      }),
    );
    expect(response.status).toBe(303);
    expect(response.headers.get('location')).toBe('/products');
  });

  it('hands a page the request under a running server', async () => {
    const html = await (
      await handler(
        new Request(`${ORIGIN}/`, {
          headers: { cookie: 'visitor=k8o', 'accept-language': 'ja' },
        }),
      )
    ).text();
    expect(html).toContain('visitor:k8o language:ja');
  });

  it('refuses a Server Action posted from another origin', async () => {
    const body = new FormData();
    body.set('name', 'mallory');
    const response = await handler(
      new Request(`${ORIGIN}/`, {
        method: 'POST',
        headers: { origin: 'https://attacker.test' },
        body,
      }),
    );
    expect(response.status).toBe(403);
  });

  it('re-renders a guestbook form posted without JavaScript with the message zod produced', async () => {
    // useActionState のフォームも hidden input で action と前回の state を運ぶ。
    // 空の name はスキーマ (minLength(1)) が拒み、per-field の文言がページに出る
    const html = await (await handler(new Request(`${ORIGIN}/`))).text();
    const body = formDataOf(html, 'guestbook-form');
    expect([...body.keys()].some((key) => key.startsWith('$ACTION'))).toBe(
      true,
    );
    body.set('name', '');
    const response = await handler(
      new Request(`${ORIGIN}/`, {
        method: 'POST',
        headers: { origin: ORIGIN },
        body,
      }),
    );
    expect(response.status).toBe(200);
    const page = await response.text();
    expect(page).toContain('data-testid="error"');
    expect(page).toContain('Too small: expected string to have');
    expect(entriesOf(page)).not.toContain('<li>');
  });

  it('signs the guestbook from a form posted without JavaScript and lists the name', async () => {
    const html = await (await handler(new Request(`${ORIGIN}/`))).text();
    const body = formDataOf(html, 'guestbook-form');
    body.set('name', 'k8o');
    const response = await handler(
      new Request(`${ORIGIN}/`, {
        method: 'POST',
        headers: { origin: ORIGIN },
        body,
      }),
    );
    expect(response.status).toBe(200);
    const page = await response.text();
    expect(page).not.toContain('data-testid="error"');
    expect(entriesOf(page)).toContain('<li>k8o</li>');
  });

  it('answers a guestbook signed without JavaScript with the cookie the action set', async () => {
    const html = await (await handler(new Request(`${ORIGIN}/`))).text();
    const body = formDataOf(html, 'guestbook-form');
    body.set('name', 'k8o');
    const response = await handler(
      new Request(`${ORIGIN}/`, {
        method: 'POST',
        headers: { origin: ORIGIN },
        body,
      }),
    );
    expect(response.headers.getSetCookie()).toStrictEqual([
      'visitor=k8o; Path=/; HttpOnly; Secure; SameSite=Lax',
    ]);
  });
});

describe('guard.ts', () => {
  it.each([
    ['a page', '/'],
    ['a URL nothing answers', '/nowhere'],
    ['a payload', '/products/index.rsc'],
  ])(
    'runs the root guard before %s, and the answer carries what it added',
    async (_what, pathname) => {
      const response = await handler(new Request(`${ORIGIN}${pathname}`));
      expect(response.headers.get('x-content-type-options')).toBe('nosniff');
    },
  );

  it('ends a request its guard answers, before the page renders', async () => {
    const response = await handler(new Request(`${ORIGIN}/members`));
    expect(response.status).toBe(401);
    expect(await response.text()).toBe(
      'members only — sign the guestbook first',
    );
  });

  it('lets through what its guard lets through', async () => {
    const response = await handler(
      new Request(`${ORIGIN}/members`, { headers: { cookie: 'visitor=k8o' } }),
    );
    expect(response.status).toBe(200);
    expect(await response.text()).toContain('data-testid="member">k8o<');
  });

  it('carries the outer guard’s headers on the answer an inner guard ended with', async () => {
    const response = await handler(new Request(`${ORIGIN}/members`));
    expect(response.headers.get('x-content-type-options')).toBe('nosniff');
  });

  it.each([
    ['the payload of a guarded page', '/members/index.rsc', { method: 'GET' }],
    ['a HEAD of a guarded page', '/members', { method: 'HEAD' }],
    [
      'a POST to a guarded page',
      '/members',
      { method: 'POST', headers: { origin: ORIGIN }, body: new FormData() },
    ],
  ])(
    'guards %s the same as its HTML',
    async (_what, pathname, init: RequestInit) => {
      const response = await handler(new Request(`${ORIGIN}${pathname}`, init));
      expect(response.status).toBe(401);
    },
  );
});

describe('the deployed application', () => {
  it('serves a page with only its production dependencies installed', () => {
    const output = execFileSync(
      process.execPath,
      ['--input-type=module', '--eval', WITHOUT_BUILD_TOOLING],
      { cwd: root, encoding: 'utf8', stdio: 'pipe' },
    );
    const [status, ...body] = output.split('\n');
    expect(status).toBe('200');
    expect(body.join('\n')).toContain('rendered on the server');
  });
});
