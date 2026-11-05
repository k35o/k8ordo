import type { Browser, Page } from 'playwright';
import { afterAll, beforeAll, describe, expect, it } from 'vite-plus/test';

import { browserTypes, buildFixture, serveBuilt } from '../../fixtures/build';
import type { BuiltFixture, ServedBuild } from '../../fixtures/build';
import {
  scriptsBeforeStylesheets,
  scriptsBeforeStylesheetsStream,
} from './head-scripts';

// React が書く文書の形: head の中は持ち上げた要素が先、レイアウトの子が後ろ
const documentWith = (head: string, body = '<main>page</main>'): string =>
  `<!DOCTYPE html><html lang="en"><head>${head}</head><body>${body}</body></html>`;

describe('scriptsBeforeStylesheets', () => {
  it('moves an inline script the layout wrote in <head> ahead of the first stylesheet', () => {
    expect(
      scriptsBeforeStylesheets(
        documentWith(
          '<meta charSet="utf-8"/><link rel="stylesheet" href="/a.css" data-precedence="p"/><title>t</title><script>first()</script>',
        ),
      ),
    ).toBe(
      documentWith(
        '<meta charSet="utf-8"/><script>first()</script><link rel="stylesheet" href="/a.css" data-precedence="p"/><title>t</title>',
      ),
    );
  });

  it('keeps the scripts in the order they were written, nonce and all, and counts a <style> as a stylesheet', () => {
    expect(
      scriptsBeforeStylesheets(
        documentWith(
          '<style data-precedence="p" data-href="o"></style><link rel="stylesheet" href="/a.css" data-precedence="p"/><script nonce="n">one()</script><meta name="x" content="y"/><script>two()</script>',
        ),
      ),
    ).toBe(
      documentWith(
        '<script nonce="n">one()</script><script>two()</script><style data-precedence="p" data-href="o"></style><link rel="stylesheet" href="/a.css" data-precedence="p"/><meta name="x" content="y"/>',
      ),
    );
  });

  it('leaves a script that is not inline, or not classic, where it was', () => {
    const html = documentWith(
      '<link rel="stylesheet" href="/a.css"/><script async="" src="/x.js"></script><script src="/b.js"></script><script type="module">m()</script><script type="application/ld+json">{}</script><script type="importmap">{}</script>',
    );
    expect(scriptsBeforeStylesheets(html)).toBe(html);
  });

  it('leaves what a <noscript> or a <template> holds where it was', () => {
    const html = documentWith(
      '<link rel="stylesheet" href="/a.css"/><noscript><script>n()</script></noscript><template><script>t()</script></template>',
    );
    expect(scriptsBeforeStylesheets(html)).toBe(html);
  });

  it('moves no script ahead of a stylesheet inside a <noscript>, which the parser never reads', () => {
    expect(
      scriptsBeforeStylesheets(
        documentWith(
          '<noscript><link rel="stylesheet" href="/n.css"/></noscript><link rel="stylesheet" href="/a.css"/><script>a()</script>',
        ),
      ),
    ).toBe(
      documentWith(
        '<noscript><link rel="stylesheet" href="/n.css"/></noscript><script>a()</script><link rel="stylesheet" href="/a.css"/>',
      ),
    );
  });

  it('reads a script’s text as text, not as the end of <head> or a stylesheet', () => {
    expect(
      scriptsBeforeStylesheets(
        documentWith(
          '<link rel="stylesheet" href="/a.css"/><script>const s = \'</head><link rel="stylesheet">\';</script><script>b()</script>',
        ),
      ),
    ).toBe(
      documentWith(
        '<script>const s = \'</head><link rel="stylesheet">\';</script><script>b()</script><link rel="stylesheet" href="/a.css"/>',
      ),
    );
  });

  it('changes nothing in a <head> with no stylesheet, or with its scripts already ahead of it', () => {
    for (const head of [
      '<meta charSet="utf-8"/><script>a()</script>',
      '<script>a()</script><link rel="stylesheet" href="/a.css"/>',
      '<link rel="preload" as="style" href="/a.css"/><script>a()</script>',
    ]) {
      expect(scriptsBeforeStylesheets(documentWith(head))).toBe(
        documentWith(head),
      );
    }
  });

  it('leaves the body alone', () => {
    const html = documentWith(
      '<link rel="stylesheet" href="/a.css"/>',
      '<script>late()</script><main>page</main>',
    );
    expect(scriptsBeforeStylesheets(html)).toBe(html);
  });

  it('leaves a document that does not open with a <head> as it is', () => {
    for (const html of [
      '<main><link rel="stylesheet" href="/a.css"/><script>a()</script></main>',
      '<!DOCTYPE html><html><body><link rel="stylesheet" href="/a.css"/><script>a()</script></body></html>',
    ]) {
      expect(scriptsBeforeStylesheets(html)).toBe(html);
    }
  });
});

const encoder = new TextEncoder();
const decoder = new TextDecoder();

/** What the stream gives for `chunks`, written one after another. */
const through = async (chunks: readonly Uint8Array[]): Promise<string> => {
  const parts: string[] = [];
  await new ReadableStream<Uint8Array>({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(chunk);
      controller.close();
    },
  })
    .pipeThrough(scriptsBeforeStylesheetsStream())
    .pipeTo(
      new WritableStream({
        write(chunk) {
          parts.push(decoder.decode(chunk, { stream: true }));
        },
      }),
    );
  return parts.join('') + decoder.decode();
};

describe('scriptsBeforeStylesheetsStream', () => {
  it('moves the scripts the same wherever the bytes are split, inside a character included', async () => {
    const bytes = encoder.encode(
      documentWith(
        '<title>配色</title><link rel="stylesheet" href="/a.css"/><script>a("夜")</script>',
        '<p>本文</p>',
      ),
    );
    const moved = documentWith(
      '<title>配色</title><script>a("夜")</script><link rel="stylesheet" href="/a.css"/>',
      '<p>本文</p>',
    );
    for (let at = 0; at <= bytes.length; at += 1) {
      expect(await through([bytes.subarray(0, at), bytes.subarray(at)])).toBe(
        moved,
      );
    }
  });

  it('sends the <head> on as soon as it has arrived, not when the document ends', async () => {
    const stream = scriptsBeforeStylesheetsStream();
    const writer = stream.writable.getWriter();
    const reader = stream.readable.getReader();
    void writer.write(
      encoder.encode(
        '<!DOCTYPE html><html><head><link rel="stylesheet" href="/a.css"/><script>a()</script></head><body><main>',
      ),
    );

    const { value } = await reader.read();
    expect(decoder.decode(value)).toBe(
      '<!DOCTYPE html><html><head><script>a()</script><link rel="stylesheet" href="/a.css"/></head>',
    );
    expect(decoder.decode((await reader.read()).value)).toBe('<body><main>');
    await writer.abort();
  });

  it('passes a document that does not open with a <head> on as it comes', async () => {
    const stream = scriptsBeforeStylesheetsStream();
    const writer = stream.writable.getWriter();
    const reader = stream.readable.getReader();
    void writer.write(encoder.encode('<main><script>a()</script>'));

    const { value } = await reader.read();
    expect(decoder.decode(value)).toBe('<main><script>a()</script>');
    await writer.abort();
  });

  it('passes on what it held when the document ends inside its <head>', async () => {
    expect(
      await through([encoder.encode('<!DOCTYPE html><html><head><title>')]),
    ).toBe('<!DOCTYPE html><html><head><title>');
  });
});

const reportedOn = (page: Page): string[] => {
  const reported: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') reported.push(message.text());
  });
  page.on('pageerror', (error) => {
    reported.push(error.message);
  });
  return reported;
};

describe('a layout that writes a script in <head>', () => {
  let built: BuiltFixture | undefined;
  let served: ServedBuild | undefined;
  let origin = '';
  // スタイルシートの応答を止めておける。止めている間に動いたスクリプトは、
  // スタイルシートより前にあった
  let stylesheets = Promise.resolve();

  beforeAll(async () => {
    built = await buildFixture('head-scripts');
    served = await serveBuilt(built, {
      hold: (url) => (url.pathname.endsWith('.css') ? stylesheets : undefined),
    });
    ({ origin } = served);
  }, 120_000);

  afterAll(async () => {
    served?.close();
    await built?.dispose();
  });

  it('writes the script ahead of the stylesheets in the HTML', async () => {
    const html = await (await fetch(origin)).text();
    const head = html.slice(html.indexOf('<head>'), html.indexOf('</head>'));

    const script = head.indexOf("classList.add('ran')");
    expect(script).toBeGreaterThan(-1);
    expect(head.indexOf('<style')).toBeGreaterThan(script);
    expect(head.indexOf('rel="stylesheet"')).toBeGreaterThan(script);
  });

  describe.each(browserTypes)('in $name', ({ type }) => {
    let browser: Browser;

    beforeAll(async () => {
      browser = await type.launch();
    });

    afterAll(async () => {
      await browser.close();
    });

    it('runs the script while the stylesheets are still loading', async () => {
      const held = Promise.withResolvers<undefined>();
      stylesheets = held.promise;
      const page = await browser.newPage();
      try {
        await page.goto(origin, { waitUntil: 'commit' });
        // スタイルシートの後ろにあれば、それが届くまで動かない
        await expect
          .poll(
            () =>
              page.evaluate(() =>
                document.documentElement.classList.contains('ran'),
              ),
            { timeout: 5000 },
          )
          .toBe(true);
      } finally {
        held.resolve(undefined);
        stylesheets = Promise.resolve();
      }
      await page.close();
    }, 30_000);

    it('hydrates the <head> with the script where it was moved, and says nothing about it', async () => {
      const page = await browser.newPage();
      const reported = reportedOn(page);
      await page.goto(origin);
      await page.getByText('hydrated').waitFor();

      expect({
        reported,
        head: await page.evaluate(() =>
          [
            ...document.head.querySelectorAll(
              'script:not([src]), style, link[rel="stylesheet"]',
            ),
          ].map((element) => element.localName),
        ),
      }).toStrictEqual({ reported: [], head: ['script', 'link', 'style'] });
      await page.close();
    }, 30_000);
  });
});
