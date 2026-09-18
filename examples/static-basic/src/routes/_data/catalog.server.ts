import 'server-only';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

// `server-only` を import したモジュールはクライアントに届かない。秘密や DB
// クライアントをここに置けば、間に何段挟まっても渡らない（渡そうとした時点で
// ビルドが落ちる）。保証は import の側にあり、`.server` という名前は木と
// import 文の上で目に入るようにするための規約。
export type Product = { id: number; name: string };

export const listProducts = async (): Promise<readonly Product[]> =>
  JSON.parse(
    // import.meta.url はバンドル後の置き場所を指すので、ビルドが走る
    // プロジェクトのルートから辿る
    await readFile(
      path.join(process.cwd(), 'src/routes/_data/catalog.json'),
      'utf8',
    ),
  ) as readonly Product[];

export const findProduct = async (id: number): Promise<Product | undefined> =>
  (await listProducts()).find((product) => product.id === id);
