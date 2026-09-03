// `.server` は、クライアントのグラフからは解決できない。秘密や DB クライアント
// をここに置けば、間に何段挟まってもクライアントには届かない（届けようとした
// 時点でビルドが落ちる）。
export type Product = { id: string; name: string };

const CATALOG: readonly Product[] = [
  { id: '1', name: 'first product' },
  { id: '2', name: 'second product' },
];

export const listProducts = (): readonly Product[] => CATALOG;

export const findProduct = (id: string): Product | undefined =>
  CATALOG.find((product) => product.id === id);
