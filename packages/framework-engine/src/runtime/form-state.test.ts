import { afterAll, beforeAll, describe, expect, it } from 'vite-plus/test';

import { buildFixture } from '../../fixtures/build';
import type { BuiltFixture } from '../../fixtures/build';

const ORIGIN = 'https://k8ordo.test';

let built: BuiltFixture | undefined;

beforeAll(async () => {
  built = await buildFixture('form-state');
}, 120_000);

afterAll(async () => {
  await built?.dispose();
});

const answer = (request: Request): Promise<Response> => {
  if (built === undefined) throw new Error('the fixture was not built');
  return built.handler(request);
};

// 属性値の中で React がエスケープした文字を戻す。useActionState が仕込む
// hidden input の値は JSON なので、&quot; を戻さないと action が復号できない
const unescapeAttribute = (value: string): string =>
  value
    .replaceAll('&quot;', '"')
    .replaceAll('&#x27;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&');

/** The form in the HTML, as the FormData a browser would post. */
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

describe('a form posted without JavaScript', () => {
  it('renders the client component its Server Action returned', async () => {
    const html = await (await answer(new Request(`${ORIGIN}/`))).text();
    const body = formDataOf(html, 'shout-form');
    body.set('name', 'k8o');

    const response = await answer(
      new Request(`${ORIGIN}/`, {
        method: 'POST',
        headers: { origin: ORIGIN },
        body,
      }),
    );
    const page = await response.text();

    expect(response.status).toBe(200);
    expect(page).toContain('<strong data-testid="shout">K8O</strong>');
  });
});
