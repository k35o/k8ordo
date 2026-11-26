import { catalogRules } from '@k8ordo/ui/catalog';
import { describe, expect, it } from 'vite-plus/test';

import { catalog } from './json-render/catalog';
import { prompt } from './openui/prompt';

const JAPANESE = /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u;

const japaneseLines = (text: string): string[] =>
  text.split('\n').filter((line) => JAPANESE.test(line));

describe('つなぎが組み立てるシステムプロンプトはアプリのロケールに関係なく英語', () => {
  it('json-render のプロンプトに日本語が無く、値を $bindState で結べると書く', () => {
    const text = catalog.prompt({ customRules: [...catalogRules] });

    expect(japaneseLines(text)).toStrictEqual([]);
    expect(text).toContain(
      'defaultValue can be bound to state with $bindState',
    );
  });

  it('OpenUI のプロンプトに日本語が無く、値を name で結ぶと書く', () => {
    const text = prompt({ additionalRules: [...catalogRules] });

    expect(japaneseLines(text)).toStrictEqual([]);
    expect(text).toContain('Bound to form state by name');
  });
});
