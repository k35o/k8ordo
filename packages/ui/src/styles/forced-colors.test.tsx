/// <reference types="vite/client" />

import { describe, expect, it } from 'vite-plus/test';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';

import { ColorPicker } from '../components/form/color-picker';
import { RangeSlider } from '../components/form/range-slider';
import { Slider } from '../components/form/slider';

import './index.css';

// high-contrast.stories.tsx のように outline の値を読まず、絵で確かめる。
// つまみは擬似要素で計算済みスタイルを読めず（Chromium は input 自身の値を
// 返す）、WebKit は強制カラーを media の一致しか真似ないので、透明の outline が
// 透明のまま読める。印は outline-offset の分だけ外に出るので、親ごと撮る
const pictureAround = (element: Element) => {
  // 強制カラーでなければ輪の影がそのまま見え、絵の比較は何も確かめない
  expect(matchMedia('(forced-colors: active)').matches).toBe(true);
  const { parentElement } = element;
  if (!parentElement) {
    throw new Error('撮る親が見つからない');
  }
  return page.screenshot({ element: parentElement, save: false });
};

// Tab で移さないのは、macOS の WebKit が OS の設定に従い、Tab でリンクや
// range に止まらないため。focus() でも、キーボードで移したときと同じく
// :focus-visible に入る
const focusVisibly = (element: HTMLElement | SVGElement) => {
  element.focus();
  expect(element.matches(':focus-visible')).toBe(true);
};

describe('強制カラーでのフォーカスの印', () => {
  it('Slider は、つまみにフォーカスがあると絵が変わる', async () => {
    await render(<Slider aria-label="音量" defaultValue={50} />);
    const thumb = page.getByRole('slider', { name: '音量' }).element();
    const blurred = await pictureAround(thumb);

    focusVisibly(thumb);

    expect(await pictureAround(thumb)).not.toBe(blurred);
  });

  it('RangeSlider は、どちらのつまみにフォーカスがあるかが絵で分かる', async () => {
    await render(<RangeSlider aria-label="価格" defaultValue={[20, 80]} />);
    const start = page.getByRole('slider', { name: '価格 minimum' }).element();
    const end = page.getByRole('slider', { name: '価格 maximum' }).element();
    const blurred = await pictureAround(start);

    focusVisibly(start);
    const startFocused = await pictureAround(start);
    focusVisibly(end);
    const endFocused = await pictureAround(end);

    expect(new Set([blurred, startFocused, endFocused]).size).toBe(3);
  });

  it('ColorPicker は、色の段のつまみにフォーカスがあると絵が変わる', async () => {
    await render(<ColorPicker aria-label="色" defaultValue="#3366cc" />);
    const hue = page.getByRole('slider', { name: 'Hue' }).element();
    const blurred = await pictureAround(hue);

    focusVisibly(hue);

    expect(await pictureAround(hue)).not.toBe(blurred);
  });
});
