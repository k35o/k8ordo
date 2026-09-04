import 'server-only';

// `server-only` を import したモジュールはクライアントに届かない。秘密や DB
// クライアントをここに置けば、間に何段挟まっても渡らない（渡そうとした時点で
// ビルドが落ちる）。保証は import の側にあり、`.server` という名前は木と
// import 文の上で目に入るようにするための規約。
export type Product = { id: string; name: string };

const CATALOG: readonly Product[] = [
  { id: '1', name: 'first product' },
  { id: '2', name: 'second product' },
];

export const listProducts = (): readonly Product[] => CATALOG;

export const findProduct = (id: string): Product | undefined =>
  CATALOG.find((product) => product.id === id);
