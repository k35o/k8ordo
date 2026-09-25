import { toTree } from './renderers';

describe('toTree（生成 UI の Tree の平らな一覧を木に組む）', () => {
  it('parentId で子を親の下に入れ、一覧の順を保つ', () => {
    expect(
      toTree([
        { id: 'src', label: 'src' },
        { id: 'a', label: 'a.ts', parentId: 'src' },
        { id: 'readme', label: 'README.md' },
        { id: 'b', label: 'b.ts', parentId: 'src' },
      ]),
    ).toStrictEqual([
      {
        id: 'src',
        label: 'src',
        children: [
          { id: 'a', label: 'a.ts' },
          { id: 'b', label: 'b.ts' },
        ],
      },
      { id: 'readme', label: 'README.md' },
    ]);
  });

  it('親が見つからない項目は根に置く', () => {
    expect(
      toTree([{ id: 'orphan', label: 'orphan', parentId: 'missing' }]),
    ).toStrictEqual([{ id: 'orphan', label: 'orphan' }]);
  });
});
