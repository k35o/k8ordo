import { execFileSync } from 'node:child_process';

// 主張の対象は組み上がったアプリなので、テストがビルドを走らせる。
// テストファイルごとに走らせると、並行するビルドが同じ dist を書き合う
export default function setup(): void {
  execFileSync('pnpm', ['exec', 'vp', 'build'], {
    cwd: import.meta.dirname,
    stdio: 'pipe',
  });
  // 同じアプリを base: '/site/' で dist/base/ に。既定のビルドの後に置くのは、
  // 既定のビルドが空にするのは dist/client などの各出力先だけで、dist/base は残るから
  execFileSync(
    'pnpm',
    ['exec', 'vp', 'build', '--config', 'vite.base.config.ts'],
    { cwd: import.meta.dirname, stdio: 'pipe' },
  );
}
