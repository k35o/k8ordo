import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { resolveConfig } from 'vite';
import type { PluginOption } from 'vite';

import { vercel } from './vercel';
import { framework } from './vite';

let root = '';

beforeAll(() => {
  root = mkdtempSync(path.join(tmpdir(), 'k8ordo-vercel-'));
});

afterAll(() => {
  rmSync(root, { recursive: true, force: true });
});

const resolved = (plugins: PluginOption[]): Promise<unknown> =>
  resolveConfig(
    { root, configFile: false, logLevel: 'silent', plugins },
    'build',
  );

const REFUSAL =
  "vercel() is for mode: 'server' — under mode: 'static' the site is dist/client/, which Vercel serves as files without it";

describe('vercel', () => {
  it('refuses static mode, rather than deploying a function that renders what the build would not write', async () => {
    await expect(
      resolved([framework({ mode: 'static' }), vercel()]),
    ).rejects.toThrow(REFUSAL);
  });

  it('refuses static mode whichever side of framework() it is placed on', async () => {
    await expect(
      resolved([vercel(), framework({ mode: 'static' })]),
    ).rejects.toThrow(REFUSAL);
  });

  it('deploys server mode', async () => {
    await expect(
      resolved([framework({ mode: 'server' }), vercel()]),
    ).resolves.toBeDefined();
  });
});
