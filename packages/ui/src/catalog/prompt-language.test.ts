import { describe, expect, it } from 'vite-plus/test';
import { z } from 'zod';

import { catalog, catalogPropIssues, catalogRules } from './index';

// LLM が読む文言はアプリのロケールと関係なく英語で書く
const JAPANESE = /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u;

const japaneseLines = (text: string): string[] =>
  text.split('\n').filter((line) => JAPANESE.test(line));

describe('LLM に渡す文言', () => {
  it('部品の説明とスキーマの説明に日本語が無い', () => {
    const texts = Object.entries(catalog).map(
      ([name, entry]) =>
        `${name}: ${entry.description}\n${JSON.stringify(z.toJSONSchema(entry.props))}`,
    );

    expect(japaneseLines(texts.join('\n'))).toStrictEqual([]);
  });

  it('横断のルールに日本語が無い', () => {
    expect(japaneseLines(catalogRules.join('\n'))).toStrictEqual([]);
  });

  it('props の検査が返す文言に日本語が無い', () => {
    const issues = [
      ...catalogPropIssues('Anchor', {
        label: 'Docs',
        href: 'ftp://example.com/docs',
        rel: 'x',
      }),
      ...catalogPropIssues('Button', {
        label: 'Docs',
        href: '//evil.example/docs',
      }),
      ...catalogPropIssues('Marquee', {}),
      ...catalogPropIssues('Table', {
        columns: [{ label: 'Name', width: 80 }],
        rows: [],
      }),
    ];

    expect(issues).toStrictEqual(
      expect.arrayContaining([
        expect.stringContaining('Anchor.href'),
        expect.stringContaining('Button.href'),
        expect.stringContaining('Unknown prop "rel"'),
        expect.stringContaining('Unknown component type "Marquee"'),
        expect.stringContaining('Table.columns.0: Unknown prop "width"'),
      ]),
    );
    expect(japaneseLines(issues.join('\n'))).toStrictEqual([]);
  });
});
