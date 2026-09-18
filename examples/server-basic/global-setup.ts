import { execFileSync } from 'node:child_process';

// 主張の対象は組み上がったアプリなので、テストがビルドを走らせる。
// テストファイルごとに走らせると、並行するビルドが同じ dist を書き合う
export default function setup(): void {
  execFileSync('pnpm', ['exec', 'vp', 'build'], {
    cwd: import.meta.dirname,
    stdio: 'pipe',
  });
}
