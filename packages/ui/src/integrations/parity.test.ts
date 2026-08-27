import { catalog } from './json-render/catalog';
import { library } from './openui/library';

const catalogNames = catalog.componentNames;
const openuiNames = Object.keys(library.components);

const diff = (a: string[], b: string[]): string[] =>
  a.filter((name) => !b.includes(name)).toSorted();

describe('json-render catalog と openui library のコンポーネント整合性', () => {
  it('どちらの登録セットも空ではない', () => {
    expect(catalogNames.length).toBeGreaterThan(0);
    expect(openuiNames.length).toBeGreaterThan(0);
  });

  it('catalog と library は同一のコンポーネント名集合を登録している', () => {
    const onlyInCatalog = diff(catalogNames, openuiNames);
    const onlyInOpenui = diff(openuiNames, catalogNames);

    expect({ onlyInCatalog, onlyInOpenui }).toStrictEqual({
      onlyInCatalog: [],
      onlyInOpenui: [],
    });
  });

  // 2 つのコンポーネントに同じ zod インスタンスを渡すと、lang-core が
  // スキーマの実体をキーに登録する都合で後勝ちになり、先に登録した方が
  // $defs から無言で消える（型エラーにならないのでこれで固定する）
  it('library の全コンポーネントが JSON Schema の $defs に出る', () => {
    // $defs は型上 optional。?? はテスト内の条件分岐として lint に弾かれるので
    // スプレッドで畳む（undefined を spread すると空オブジェクトになる）
    const defs = { ...library.toJSONSchema().$defs };

    expect(diff(openuiNames, Object.keys(defs))).toStrictEqual([]);
  });
});
