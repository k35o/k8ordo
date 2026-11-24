/// <reference types="vite/client" />

import { afterEach, describe, expect, it } from 'vite-plus/test';

// 配布物そのものを読む。CI はテストの前に組み、手元では pnpm build のあとに走らせる
import tokensCss from '../../dist/styles/tokens.css?raw';

const sheet = new CSSStyleSheet();
sheet.replaceSync(tokensCss);
const darkTokenNames = [...sheet.cssRules]
  .filter(
    (rule): rule is CSSStyleRule =>
      rule instanceof CSSStyleRule && rule.selectorText === ':root',
  )
  .flatMap((rule) =>
    [...rule.style].filter((name) =>
      rule.style.getPropertyValue(name).includes('light-dark('),
    ),
  );

const openPage = async (...styles: string[]): Promise<Window> => {
  const frame = document.createElement('iframe');
  const loaded = new Promise((resolve) => {
    frame.addEventListener('load', resolve, { once: true });
  });
  frame.srcdoc = `<!doctype html>${styles
    .map((css) => `<style>${css}</style>`)
    .join('')}`;
  document.body.append(frame);
  await loaded;
  const page = frame.contentWindow;
  if (!page) {
    throw new Error('ページを開けない');
  }
  // OS の配色は試験の中で切り替えず、プロジェクトが contextOptions でダークを
  // 敷く（vite.config.ts）
  expect(page.matchMedia('(prefers-color-scheme: dark)').matches).toBe(true);
  return page;
};

// light-dark() は使った要素の color-scheme で決まるので、変数の文字列ではなく、
// 文字の色に使ったときの値を読む
const colorsIn = (page: Window, parent: Element, colorScheme = '') => {
  const probe = page.document.createElement('div');
  probe.style.colorScheme = colorScheme;
  parent.append(probe);
  const colors = Object.fromEntries(
    darkTokenNames.map((name) => {
      probe.style.color = `var(${name})`;
      return [name, page.getComputedStyle(probe).color];
    }),
  );
  probe.remove();
  return colors;
};

// 値は書き写さず、color-scheme を自分で決めた要素が使う値を、それぞれの側の値にする
const sidesIn = (page: Window) => {
  const light = colorsIn(page, page.document.body, 'light');
  const dark = colorsIn(page, page.document.body, 'dark');
  // 2 つの側が同じなら、どちらの側になったかを比べても何も確かめない
  expect(darkTokenNames.length).toBeGreaterThan(40);
  expect(dark).not.toStrictEqual(light);
  return { light, dark };
};

afterEach(() => {
  for (const frame of document.querySelectorAll('iframe')) {
    frame.remove();
  }
});

describe('tokens.css だけを読んだページ', () => {
  it('クラスが無ければ、OS がダークでも明るい側の色になる', async () => {
    const page = await openPage(tokensCss);

    expect(colorsIn(page, page.document.body)).toStrictEqual(
      sidesIn(page).light,
    );
  });

  it('html に dark クラスを付けると、暗い側の色になる', async () => {
    const page = await openPage(tokensCss);

    page.document.documentElement.classList.add('dark');

    expect(colorsIn(page, page.document.body)).toStrictEqual(
      sidesIn(page).dark,
    );
  });

  it('入れ子の .dark は、その中だけが暗い側の色になる', async () => {
    const page = await openPage(tokensCss);
    const island = page.document.createElement('div');
    island.className = 'dark';

    page.document.body.append(island);

    const { light, dark } = sidesIn(page);
    expect(colorsIn(page, island)).toStrictEqual(dark);
    expect(colorsIn(page, page.document.body)).toStrictEqual(light);
  });

  it('ページがレイヤーなしで color-scheme: light dark を書くと、OS がダークなら暗い側の色になる', async () => {
    // tokens.css より先に書く。後に書くと、tokens.css の規則がレイヤーの外に
    // あっても順で勝ってしまい、レイヤーの中にあることを確かめない
    const page = await openPage(
      ':root { color-scheme: light dark; }',
      tokensCss,
    );

    expect(colorsIn(page, page.document.body)).toStrictEqual(
      sidesIn(page).dark,
    );
  });
});
