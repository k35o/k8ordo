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

// 値は書き写さず、画面で測った値と比べる
const darkTokenNames = () =>
  [...document.styleSheets]
    .flatMap((sheet) => Array.from(sheet.cssRules))
    .filter(
      (rule): rule is CSSStyleRule =>
        rule instanceof CSSStyleRule && rule.selectorText === ':root',
    )
    .flatMap((rule) =>
      [...rule.style].filter((name) =>
        rule.style.getPropertyValue(name).includes('light-dark('),
      ),
    );

// light-dark() は使った要素の color-scheme で決まるので、変数の文字列ではなく、
// 文字の色に使ったときの値を読む
const colorsOf = (names: string[]) => {
  const probe = document.createElement('div');
  document.body.append(probe);
  const colors = Object.fromEntries(
    names.map((name) => {
      probe.style.color = `var(${name})`;
      return [name, getComputedStyle(probe).color];
    }),
  );
  probe.remove();
  return colors;
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
  it('.dark が付いていても、ダークの値を持つトークンはライトの色になる', async () => {
    const names = darkTokenNames();
    const light = colorsOf(names);
    root.classList.add('dark');

    await commands.emulateMedia({ media: 'print' });

    expect(names.length).toBeGreaterThan(40);
    expect(colorsOf(names)).toStrictEqual(light);
  });

  it('print-as-shown を含む .dark は、ダークの色のまま刷る', async () => {
    const names = darkTokenNames();
    const light = colorsOf(names);
    root.classList.add('dark');
    const dark = colorsOf(names);
    keepShownInPrint();

    await commands.emulateMedia({ media: 'print' });

    expect(dark).not.toStrictEqual(light);
    expect(colorsOf(names)).toStrictEqual(dark);
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
