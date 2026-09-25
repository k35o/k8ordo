import 'server-only';

// `server-only` を import したモジュールはクライアントに届かない。秘密や DB
// クライアントをここに置けば、間に何段挟まっても渡らない（渡そうとした時点で
// ビルドが落ちる）。保証は import の側にあり、`.server` という名前は木と
// import 文の上で目に入るようにするための規約。
export type Product = { id: number; name: string };

const CATALOG: readonly Product[] = [
  { id: 1, name: 'first product' },
  { id: 2, name: 'second product' },
];

// データベースの往復の代わり。ページはシェルより遅れて届き、layout を先に
// 描いたままストリームの後ろで差し込まれる
const roundTrip = (): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, 200);
  });

export const listProducts = async (): Promise<readonly Product[]> => {
  await roundTrip();
  return CATALOG;
};

export const findProduct = async (id: number): Promise<Product | undefined> =>
  (await listProducts()).find((product) => product.id === id);
