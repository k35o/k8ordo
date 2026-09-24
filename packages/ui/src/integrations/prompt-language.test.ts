import { catalog, uiRules, validateGeneratedSpec } from './json-render/catalog';
import { prompt } from './openui/prompt';

// LLM が読む文言はアプリのロケールと関係なく英語で書く
const JAPANESE = /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u;

const japaneseLines = (text: string): string[] =>
  text.split('\n').filter((line) => JAPANESE.test(line));

// 未知の部品名・未知の prop・形式違反の 3 種類のメッセージをすべて出させる
const repairPrompt = (): string => {
  const result = validateGeneratedSpec({
    root: 'root',
    elements: {
      root: {
        type: 'Stack',
        props: {},
        children: ['link', 'marquee'],
      },
      link: {
        type: 'Anchor',
        props: { label: 'Docs', href: 'ftp://example.com/docs', rel: 'x' },
        children: [],
      },
      marquee: { type: 'Marquee', props: {}, children: [] },
    },
  });
  return result.ok ? '' : result.repairPrompt;
};

describe('LLM に渡す文言', () => {
  it('json-render のシステムプロンプトに日本語が無い', () => {
    expect(
      japaneseLines(catalog.prompt({ customRules: [...uiRules] })),
    ).toStrictEqual([]);
  });

  it('OpenUI のシステムプロンプトに日本語が無い', () => {
    expect(japaneseLines(prompt())).toStrictEqual([]);
  });

  it('スキーマ違反から作る修復プロンプトに日本語が無い', () => {
    const text = repairPrompt();

    expect(text).toContain('Anchor.href');
    expect(text).toContain('Unknown prop "rel"');
    expect(text).toContain('Unknown component type "Marquee"');
    expect(japaneseLines(text)).toStrictEqual([]);
  });
});
