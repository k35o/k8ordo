import { resetStateRegistry } from '@k8ordo/state';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import {
  beforeEach,
  describe,
  expect,
  it,
  onTestFinished,
  vi,
} from 'vite-plus/test';
import { renderHook } from 'vitest-browser-react';

import { ColorSchemeProvider, useColorScheme } from './provider';
import type { ColorSchemeScriptOptions } from './scheme';
import { colorSchemeScriptHash, colorSchemeState, scriptFor } from './scheme';
import { ColorSchemeScript } from './script';
import type { ColorSchemeScriptProps } from './script';

const root = document.documentElement;

const themeColor = { light: '#fafafa', dark: '#18181b' } as const;

// What the browser paints its own UI in: the first theme-color <meta>, in
// tree order, whose media matches.
const themeColorOf = (doc: Document): string | undefined =>
  [...doc.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')].find(
    (meta) =>
      meta.media === '' || doc.defaultView?.matchMedia(meta.media).matches,
  )?.content;

const mediaOf = (scheme: 'light' | 'dark'): string | undefined =>
  document.querySelector<HTMLMetaElement>(
    `meta[name="theme-color"][content="${themeColor[scheme]}"]`,
  )?.media;

// The way it runs in production: an inline script in the document.
const run = (options: ColorSchemeScriptOptions = {}): void => {
  const script = document.createElement('script');
  script.textContent = scriptFor(options);
  document.head.append(script);
  script.remove();
};

const SystemByDefault = ({ children }: { children: ReactNode }) => (
  <ColorSchemeProvider>{children}</ColorSchemeProvider>
);

const DarkByDefault = ({ children }: { children: ReactNode }) => (
  <ColorSchemeProvider defaultPreference="dark">{children}</ColorSchemeProvider>
);

beforeEach(() => {
  localStorage.clear();
  root.classList.remove('dark');
  for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
    meta.remove();
  }
  resetStateRegistry();
});

describe('useColorScheme', () => {
  it('still renders when the browser refuses localStorage, and a choice holds until the next load', async () => {
    // サイトのデータを止めたブラウザは、localStorage を読むだけで投げる
    const spy = vi
      .spyOn(window, 'localStorage', 'get')
      .mockImplementation(() => {
        throw new DOMException('denied', 'SecurityError');
      });
    onTestFinished(() => {
      spy.mockRestore();
    });

    const { result, act } = await renderHook(() => useColorScheme(), {
      wrapper: DarkByDefault,
    });
    expect(result.current.preference).toBe('system');
    expect(result.current.scheme).toBe('dark');

    await act(() => {
      result.current.setPreference('light');
    });

    expect(result.current.scheme).toBe('light');
    expect(root.classList.contains('dark')).toBe(false);
  });

  it('follows the system when nothing is stored', async () => {
    const { result } = await renderHook(() => useColorScheme(), {
      wrapper: SystemByDefault,
    });

    // The test browser prefers light, which is what "system" resolves to.
    expect(result.current.preference).toBe('system');
    expect(result.current.scheme).toBe('light');
    expect(root.classList.contains('dark')).toBe(false);
  });

  it('starts from the default the provider was given, until the visitor chooses', async () => {
    const { result } = await renderHook(() => useColorScheme(), {
      wrapper: DarkByDefault,
    });

    expect(result.current.preference).toBe('system');
    expect(result.current.scheme).toBe('dark');
    expect(root.classList.contains('dark')).toBe(true);

    result.current.setPreference('light');
    await vi.waitFor(() => {
      expect(result.current.scheme).toBe('light');
    });
    expect(root.classList.contains('dark')).toBe(false);
  });

  it('stores a preference, puts the class on <html>, and takes it off again', async () => {
    const { result } = await renderHook(() => useColorScheme(), {
      wrapper: SystemByDefault,
    });

    result.current.setPreference('dark');
    await vi.waitFor(() => {
      expect(result.current.scheme).toBe('dark');
    });
    expect(result.current.preference).toBe('dark');
    expect(root.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem(colorSchemeState.storageKey)).toContain(
      '"preference":"dark"',
    );

    result.current.setPreference('system');
    await vi.waitFor(() => {
      expect(result.current.scheme).toBe('light');
    });
    expect(result.current.preference).toBe('system');
    expect(root.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem(colorSchemeState.storageKey)).not.toContain(
      'preference',
    );
  });

  it('keeps the theme colour with what the visitor picks, and hands it back to the system on system', async () => {
    run({ themeColor });
    const { result } = await renderHook(() => useColorScheme(), {
      wrapper: SystemByDefault,
    });

    result.current.setPreference('dark');
    await vi.waitFor(() => {
      expect(themeColorOf(document)).toBe(themeColor.dark);
    });

    result.current.setPreference('light');
    await vi.waitFor(() => {
      expect(mediaOf('dark')).toBe('not all');
    });
    expect(themeColorOf(document)).toBe(themeColor.light);

    result.current.setPreference('system');
    await vi.waitFor(() => {
      expect(mediaOf('dark')).toBe('(prefers-color-scheme: dark)');
    });
    expect(mediaOf('light')).toBe('(prefers-color-scheme: light)');
  });
});

const Probe = ({ onCommit }: { onCommit?: (scheme: string) => void }) => {
  const { scheme } = useColorScheme();
  useEffect(() => {
    onCommit?.(scheme);
  }, [onCommit, scheme]);
  return <span>{scheme}</span>;
};

// The provider's server render, hydrated over, for a visitor who stored
// dark — resolved once the provider's effects for the stored scheme have run.
const hydrateStoredDark = async (): Promise<string> => {
  const committed: string[] = [];
  const app = (
    <ColorSchemeProvider>
      <Probe
        onCommit={(scheme) => {
          committed.push(scheme);
        }}
      />
    </ColorSchemeProvider>
  );
  const container = document.createElement('div');
  // The server's answer: it has no store to read, so it says light.
  const html = renderToString(app);
  container.innerHTML = html;
  document.body.append(container);
  const hydrated = hydrateRoot(container, app);
  onTestFinished(() => {
    hydrated.unmount();
    container.remove();
  });
  // 子の effect は親の effect と同じ流れで先に走るので、子が dark を見た時点で
  // Provider の effect も済んでいる
  await vi.waitFor(() => {
    expect(committed).toContain('dark');
  });
  return html;
};

describe('ColorSchemeProvider under hydration', () => {
  it('writes nothing around its children, and never takes off the class the script put on', async () => {
    localStorage.setItem(
      colorSchemeState.storageKey,
      JSON.stringify({ preference: 'dark' }),
    );
    // What the inline script did before React loaded.
    root.classList.add('dark');
    const seen: Array<string | null> = [];
    const observer = new MutationObserver((records) => {
      for (const record of records) seen.push(record.oldValue);
    });
    observer.observe(root, {
      attributes: true,
      attributeFilter: ['class'],
      attributeOldValue: true,
    });

    const html = await hydrateStoredDark();
    for (const record of observer.takeRecords()) seen.push(record.oldValue);
    observer.disconnect();

    expect(html).toBe('<span>light</span>');
    // A record whose old value lacks the class is a moment it was off.
    expect(
      seen.filter((value) => !String(value).includes('dark')),
    ).toStrictEqual([]);
    expect(root.classList.contains('dark')).toBe(true);
  });

  it('never moves the theme colour off the one the script chose', async () => {
    localStorage.setItem(
      colorSchemeState.storageKey,
      JSON.stringify({ preference: 'dark' }),
    );
    run({ themeColor });
    const changed: MutationRecord[] = [];
    const observer = new MutationObserver((records) => {
      changed.push(...records);
    });
    observer.observe(document.head, {
      subtree: true,
      attributes: true,
      attributeFilter: ['media'],
      attributeOldValue: true,
    });

    await hydrateStoredDark();
    changed.push(...observer.takeRecords());
    observer.disconnect();

    // 同じ値を書き直すのは構わない。別の値を経て戻ってくると、その次の記録の
    // 古い値が今の値と食い違う
    expect(
      changed.filter(
        ({ target, oldValue }) =>
          (target as HTMLMetaElement).media !== oldValue,
      ),
    ).toStrictEqual([]);
    expect(themeColorOf(document)).toBe(themeColor.dark);
  });
});

// Calls back once the tree it sits in has committed.
const Committed = ({ onCommit }: { onCommit: () => void }) => {
  useEffect(onCommit, [onCommit]);
  return null;
};

describe('ColorSchemeScript', () => {
  it.each([
    ['without', { defaultPreference: 'dark' }],
    ['with', { defaultPreference: 'dark', themeColor }],
  ] as const)(
    'signs the script with the nonce it is given, and hydrates over it %s the colours: the same node, not run again',
    async (_, options) => {
      const app = (onCommit: () => void) => (
        <>
          <ColorSchemeScript {...options} nonce="bm9uY2U=" />
          <Committed onCommit={onCommit} />
        </>
      );
      const container = document.createElement('div');
      container.innerHTML = renderToString(
        app(() => {
          // the server commits nothing
        }),
      );
      const script = container.querySelector('script');
      expect(script?.nonce).toBe('bm9uY2U=');
      expect(script?.textContent).toBe(scriptFor(options));
      document.body.append(container);
      const hydrated = Promise.withResolvers<undefined>();
      const recoverable: unknown[] = [];
      const mounted = hydrateRoot(
        container,
        app(() => {
          hydrated.resolve(undefined);
        }),
        {
          onRecoverableError: (error) => {
            recoverable.push(error);
          },
        },
      );
      onTestFinished(() => {
        mounted.unmount();
        container.remove();
      });
      await hydrated.promise;

      // 本文が食い違えば、React は回復できるエラーを報告して描き直す
      expect(recoverable).toStrictEqual([]);
      expect(container.querySelector('script')).toBe(script);
      // innerHTML の script は動かず、hydrate も動かさない
      expect(root.classList.contains('dark')).toBe(false);
      expect(themeColorOf(document)).toBeUndefined();
    },
  );
});

// A document of its own, under the policy its <meta> states, with the
// script's server render in its <head> — the script as React writes it.
const underPolicy = async (
  policy: string,
  props: ColorSchemeScriptProps,
): Promise<Document> => {
  const frame = document.createElement('iframe');
  frame.srcdoc = `<!doctype html><html><head><meta http-equiv="Content-Security-Policy" content="${policy}">${renderToString(
    <ColorSchemeScript {...props} />,
  )}</head><body></body></html>`;
  const loaded = new Promise((resolve) => {
    frame.addEventListener('load', resolve, { once: true });
  });
  document.body.append(frame);
  await loaded;
  onTestFinished(() => {
    frame.remove();
  });
  return frame.contentDocument as Document;
};

describe('colorSchemeScriptHash', () => {
  it('lets the inline script run under a policy that names it', async () => {
    const hash = await colorSchemeScriptHash({ defaultPreference: 'dark' });
    const framed = await underPolicy(`script-src ${hash}`, {
      defaultPreference: 'dark',
    });
    expect(framed.documentElement.classList.contains('dark')).toBe(true);
  });

  it('is what a policy has to name: without it the script is refused', async () => {
    const framed = await underPolicy(
      `script-src ${await colorSchemeScriptHash({ defaultPreference: 'light' })}`,
      { defaultPreference: 'dark' },
    );
    expect(framed.documentElement.classList.contains('dark')).toBe(false);
  });

  it('carries the theme colour, so the hash of a script without it is refused', async () => {
    const options = { defaultPreference: 'dark', themeColor } as const;
    const allowed = await underPolicy(
      `script-src ${await colorSchemeScriptHash(options)}`,
      options,
    );
    expect(themeColorOf(allowed)).toBe(themeColor.dark);

    const refused = await underPolicy(
      `script-src ${await colorSchemeScriptHash({ defaultPreference: 'dark' })}`,
      options,
    );
    expect(refused.documentElement.classList.contains('dark')).toBe(false);
    expect(themeColorOf(refused)).toBeUndefined();
  });
});

describe('the inline script', () => {
  it('puts the class on before hydration when dark is stored', () => {
    localStorage.setItem(
      colorSchemeState.storageKey,
      JSON.stringify({ preference: 'dark' }),
    );
    run();
    expect(root.classList.contains('dark')).toBe(true);
  });

  it('starts from the default when nothing is stored', () => {
    run({ defaultPreference: 'dark' });
    expect(root.classList.contains('dark')).toBe(true);
  });

  it('leaves it off for light, and reads anything else as nothing chosen', () => {
    localStorage.setItem(
      colorSchemeState.storageKey,
      JSON.stringify({ preference: 'light' }),
    );
    run({ defaultPreference: 'dark' });
    expect(root.classList.contains('dark')).toBe(false);

    // A row the schema would refuse is nothing chosen — the system, light here.
    localStorage.setItem(colorSchemeState.storageKey, '{"preference":"sepia"}');
    run();
    expect(root.classList.contains('dark')).toBe(false);

    localStorage.setItem(colorSchemeState.storageKey, 'not json');
    run();
    expect(root.classList.contains('dark')).toBe(false);
  });
});

describe('the theme colour the inline script writes', () => {
  it('is the colour of the scheme the visitor chose, whatever the system says', () => {
    localStorage.setItem(
      colorSchemeState.storageKey,
      JSON.stringify({ preference: 'dark' }),
    );
    run({ themeColor });
    // The test browser prefers light.
    expect(themeColorOf(document)).toBe(themeColor.dark);
  });

  it('is the default’s colour when nothing is stored, and the choice’s over it', () => {
    run({ defaultPreference: 'dark', themeColor });
    expect(themeColorOf(document)).toBe(themeColor.dark);

    for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
      meta.remove();
    }
    localStorage.setItem(
      colorSchemeState.storageKey,
      JSON.stringify({ preference: 'light' }),
    );
    run({ defaultPreference: 'dark', themeColor });
    expect(themeColorOf(document)).toBe(themeColor.light);
  });

  it('is left to the system while nothing is chosen: each colour under its own prefers-color-scheme', () => {
    run({ themeColor });
    expect(mediaOf('light')).toBe('(prefers-color-scheme: light)');
    expect(mediaOf('dark')).toBe('(prefers-color-scheme: dark)');
    expect(themeColorOf(document)).toBe(themeColor.light);
  });

  it('is not written without the colours', () => {
    run({ defaultPreference: 'dark' });
    expect(document.querySelector('meta[name="theme-color"]')).toBeNull();
  });
});
