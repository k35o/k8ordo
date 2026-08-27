import { library } from '@k8ordo/ui/openui';
import { createParser } from '@openuidev/react-lang';

import { openUiResponse } from './demo';

// OpenUI Lang は完全な位置引数なので、シグネチャとずれた DSL も型エラーにならず、
// パーサが要素を丸ごと落として無言で何も描画しなくなる。<Renderer> が内部で使うのと
// 同じパーサを直接回し、デモが本当に描画可能であることを固定する。
const result = createParser(library.toJSONSchema()).parse(openUiResponse);

const collectTypeNames = (node: unknown, into: string[]): string[] => {
  if (
    typeof node !== 'object' ||
    node === null ||
    !('typeName' in node) ||
    typeof node.typeName !== 'string'
  ) {
    return into;
  }
  into.push(node.typeName);
  const props: unknown = 'props' in node ? node.props : undefined;
  if (typeof props === 'object' && props !== null) {
    for (const value of Object.values(props)) {
      if (Array.isArray(value)) {
        for (const child of value as unknown[]) {
          collectTypeNames(child, into);
        }
      }
    }
  }
  return into;
};

test('デモの DSL は root まで解決でき、検証エラーが無い', () => {
  expect(result.meta).toMatchObject({
    errors: [],
    incomplete: false,
    orphaned: [],
    unresolved: [],
  });
  expect(result.root?.typeName).toBe('Card');
});

test('デモが宣言した要素はすべて描画ツリーに乗る', () => {
  // statementCount は root を含む全宣言数。ツリー上の要素数と一致すれば
  // 「宣言したのに描画されない要素」が 1 つも無いと言える。
  expect(collectTypeNames(result.root, [])).toHaveLength(
    result.meta.statementCount,
  );
});
