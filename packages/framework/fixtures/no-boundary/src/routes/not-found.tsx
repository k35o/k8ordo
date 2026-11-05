// 404.html を描くときに throw する not-found。ページと同じく、ビルドは
// 404.html を挙げて止まる
export default function BrokenNotFound(): never {
  throw new Error('not-found broken with no boundary above it');
}
