/// <reference types="vite/client" />

import { afterEach, describe, expect, it } from 'vite-plus/test';
import { commands } from 'vitest/browser';

import './index.css';

declare module 'vitest/browser' {
  // oxlint-disable-next-line typescript/consistent-type-definitions -- augmentation needs a merge-open interface
  interface BrowserCommands {
    emulateMedia: (options: { media: 'print' | null }) => Promise<void>;
  }
}

const root = document.documentElement;

// .dark が上書きするトークンの名前。値は書き写さず、画面で測った値と比べる
const darkTokenNames = () => {
  const darkRule = [...document.styleSheets]
    .flatMap((sheet) => Array.from(sheet.cssRules))
    .find(
      (rule): rule is CSSStyleRule =>
        rule instanceof CSSStyleRule && rule.selectorText === '.dark',
    );
  if (!darkRule) {
    throw new Error('.dark の規則が見つからない');
  }
  return [...darkRule.style].filter((name) => name.startsWith('--'));
};

const tokensOf = (names: string[]) => {
  const style = getComputedStyle(root);
  return Object.fromEntries(
    names.map((name) => [name, style.getPropertyValue(name)]),
  );
};

const keepShownInPrint = () => {
  const marker = document.createElement('div');
  marker.className = 'print-as-shown';
  document.body.append(marker);
};

afterEach(async () => {
  await commands.emulateMedia({ media: null });
  // 印を .dark より先に外す。.dark を外してから印を消し、次の試験が .dark を
  // 付けるまでスタイルが計算されないと、Firefox は :has(.print-as-shown) の
  // 変化を取りこぼし、印があるときのスタイルのまま残す
  document.querySelector('.print-as-shown')?.remove();
  root.classList.remove('dark');
});

// contrast は試験の中で切り替えず、プロジェクトが contextOptions で敷く（vite.config.ts）
const contrast = matchMedia('(prefers-contrast: more)').matches
  ? 'prefers-contrast: more'
  : '既定のコントラスト';

describe(`${contrast} で刷る`, () => {
  it('.dark が付いていても、.dark が上書きするトークンはライトの値になる', async () => {
    const names = darkTokenNames();
    const light = tokensOf(names);
    root.classList.add('dark');

    await commands.emulateMedia({ media: 'print' });

    expect(names.length).toBeGreaterThan(40);
    expect(tokensOf(names)).toStrictEqual(light);
  });

  it('print-as-shown を含む .dark は、ダークの値のまま刷る', async () => {
    const names = darkTokenNames();
    const light = tokensOf(names);
    root.classList.add('dark');
    const dark = tokensOf(names);
    keepShownInPrint();

    await commands.emulateMedia({ media: 'print' });

    expect(dark).not.toStrictEqual(light);
    expect(tokensOf(names)).toStrictEqual(dark);
  });
});

describe('刷るときの color-scheme', () => {
  it('.dark が付いていても light になる', async () => {
    root.classList.add('dark');

    await commands.emulateMedia({ media: 'print' });

    expect(getComputedStyle(root).colorScheme).toBe('light');
  });

  it('print-as-shown を含む .dark では dark のまま', async () => {
    root.classList.add('dark');
    keepShownInPrint();

    await commands.emulateMedia({ media: 'print' });

    expect(getComputedStyle(root).colorScheme).toBe('dark');
  });
});
