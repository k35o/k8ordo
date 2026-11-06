// ビルド時に throw するページ。静的ビルドはこれを書き出さずに止まる
export default function BrokenPage(): never {
  throw new Error('broken on purpose');
}
