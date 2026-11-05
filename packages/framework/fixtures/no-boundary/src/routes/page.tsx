// 上に error.tsx も Suspense も無いまま throw するページ。HTML の描画そのものが
// 失敗するが、ビルドはページ名を挙げて止まる
export default function BrokenPage(): never {
  throw new Error('broken with no boundary above it');
}
