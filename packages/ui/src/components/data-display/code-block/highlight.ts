import { bundledLanguages, codeToHtml, createCssVariablesTheme } from 'shiki';
import type { ShikiTransformer } from 'shiki';

type LineMark = 'highlight' | 'add' | 'remove';

type Options = {
  lang: string;
  marks?: Readonly<Record<number, LineMark>> | undefined;
  callouts?: Readonly<Record<number, string | readonly string[]>> | undefined;
};

// 色は --shiki-token-* の変数で出し、値は ui のトークンに結びつける
// （base.css の .ao-code-block）。.dark でトークンが切り替わるので、
// ダーク用のテーマを別に持たない
const theme = createCssVariablesTheme({
  name: 'k8ordo-ui',
  variablePrefix: '--shiki-',
  fontStyle: true,
});

// 知らない言語名はエラーにせず、色を付けずに出す。Markdown のフェンスから
// 来る名前は書き手次第なので、ここで落とすとページごと描けなくなる
const resolveLang = (lang: string): string =>
  Object.hasOwn(bundledLanguages, lang) ? lang : 'text';

const annotate = (
  code: string,
  marks: Options['marks'],
  callouts: Options['callouts'],
): ShikiTransformer => ({
  name: 'k8ordo-ui:annotate',
  pre(node) {
    if (marks !== undefined && Object.keys(marks).length > 0) {
      node.properties['data-marked'] = '';
    }
  },
  line(node, line) {
    const mark = marks?.[line];
    if (mark !== undefined) {
      node.properties['data-mark'] = mark;
    }
  },
  code(node) {
    if (callouts === undefined) return;
    const sourceLines = code.split('\n');
    // 行の span の直後（改行の後）に、注記の行を差し込む
    const lines = node.children.filter(
      (child) => child.type === 'element' && child.tagName === 'span',
    );
    for (const [index, lineNode] of lines.entries()) {
      const notes = callouts[index + 1];
      if (notes === undefined) continue;
      // 注記は、それが指す行の字下げに揃える
      const indent = /^\s*/u.exec(sourceLines[index] ?? '')?.[0].length ?? 0;
      const position = node.children.indexOf(lineNode);
      node.children.splice(
        position + 1,
        0,
        ...(typeof notes === 'string' ? [notes] : notes).flatMap((text) => [
          { type: 'text' as const, value: '\n' },
          {
            type: 'element' as const,
            tagName: 'span',
            properties: {
              'data-callout': '',
              style: `--ao-callout-indent:${String(indent)}ch`,
            },
            children: [{ type: 'text' as const, value: text }],
          },
        ]),
      );
    }
  },
});

export const highlight = (code: string, options: Options): Promise<string> =>
  codeToHtml(code, {
    lang: resolveLang(options.lang),
    theme,
    transformers: [annotate(code, options.marks, options.callouts)],
  });
