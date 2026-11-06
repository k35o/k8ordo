// ビルド時に throw する not-found。静的ビルドは 404.html を書かずに止まる
export default function BrokenNotFoundPage(): never {
  throw new Error('not-found broken on purpose');
}
