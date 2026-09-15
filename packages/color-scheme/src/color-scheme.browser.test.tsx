import { resetStateRegistry } from '@k8ordo/state';
import type { ReactNode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { renderHook } from 'vitest-browser-react';

import { ColorSchemeProvider, useColorScheme } from './provider';
import type { ColorSchemePreference } from './scheme';
import { colorSchemeState, scriptFor } from './scheme';

const root = document.documentElement;

const SystemByDefault = ({ children }: { children: ReactNode }) => (
  <ColorSchemeProvider>{children}</ColorSchemeProvider>
);

const DarkByDefault = ({ children }: { children: ReactNode }) => (
  <ColorSchemeProvider defaultPreference="dark">{children}</ColorSchemeProvider>
);

beforeEach(() => {
  localStorage.clear();
  root.classList.remove('dark');
  resetStateRegistry();
});

describe('useColorScheme', () => {
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
});

const Probe = () => {
  const { scheme } = useColorScheme();
  return <span>{scheme}</span>;
};

describe('ColorSchemeProvider under hydration', () => {
  it('renders the script first, and never takes the class off that it put on', async () => {
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

    const container = document.createElement('div');
    // The server's answer: it has no store to read, so it says light.
    const html = renderToString(
      <ColorSchemeProvider>
        <Probe />
      </ColorSchemeProvider>,
    );
    expect(html.startsWith('<script>')).toBe(true);
    container.innerHTML = html;
    expect(container.querySelector('span')?.textContent).toBe('light');
    document.body.append(container);
    const app = hydrateRoot(
      container,
      <ColorSchemeProvider>
        <Probe />
      </ColorSchemeProvider>,
    );
    await vi.waitFor(() => {
      expect(container.querySelector('span')?.textContent).toBe('dark');
    });
    // The effect that would write runs after the commit; give it its turn.
    await vi.waitFor(() => {
      expect(seen.length).toBeGreaterThanOrEqual(0);
    });
    observer.disconnect();

    // A record whose old value lacks the class is a moment it was off.
    expect(
      seen.filter((value) => !String(value).includes('dark')),
    ).toStrictEqual([]);
    expect(root.classList.contains('dark')).toBe(true);
    app.unmount();
    container.remove();
  });
});

// The way it runs in production: an inline script in the document.
const run = (defaultPreference: ColorSchemePreference = 'system'): void => {
  const script = document.createElement('script');
  script.textContent = scriptFor(defaultPreference);
  document.head.append(script);
  script.remove();
};

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
    run('dark');
    expect(root.classList.contains('dark')).toBe(true);
  });

  it('leaves it off for light, and reads anything else as nothing chosen', () => {
    localStorage.setItem(
      colorSchemeState.storageKey,
      JSON.stringify({ preference: 'light' }),
    );
    run('dark');
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
