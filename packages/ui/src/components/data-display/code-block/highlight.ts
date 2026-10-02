import { bundledLanguages, codeToHtml } from 'shiki';
import type { ShikiTransformer } from 'shiki';

type LineMark = 'highlight' | 'add' | 'remove';

type Options = {
  lang: string;
  marks?: Readonly<Record<number, LineMark>> | undefined;
  callouts?: Readonly<Record<number, string | readonly string[]>> | undefined;
};

// one-light と plastic には、コードの地（#fafafa / #21252b）や行の印の地に
// 対して 4.5:1 に届かない色がある。それだけを、色相と彩度を保ったまま
// 明度をずらした色に置き換える
const AA_REPLACEMENTS = {
  'one-light': {
    '#0184bc': '#0072a9',
    '#4078f2': '#2e64dc',
    '#50a14f': '#287b2a',
    '#696c77': '#686b76',
    '#986801': '#926200',
    '#a0a1a7': '#6a6b71',
    '#c18401': '#995e00',
    '#e45649': '#c5382f',
  },
  plastic: {
    '#5f6672': '#949ba8',
    '#b57edc': '#bb84e3',
    '#e06c75': '#ec777f',
  },
};

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

// 色は light-dark() で出す。base.css が .dark で color-scheme を切り替えるので、
// ライトとダークの 2 つのテーマを、クラスの切り替えだけで出し分けられる
export const highlight = (code: string, options: Options): Promise<string> =>
  codeToHtml(code, {
    lang: resolveLang(options.lang),
    themes: { light: 'one-light', dark: 'plastic' },
    defaultColor: 'light-dark()',
    colorsRendering: 'none',
    colorReplacements: AA_REPLACEMENTS,
    transformers: [annotate(code, options.marks, options.callouts)],
  });
