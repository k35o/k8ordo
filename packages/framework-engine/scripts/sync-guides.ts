// static と server の docs は、どちらもインストールした側の node_modules から
// 読まれる文書なので、共通の節を両方に持つしかない。二重に持つ以上、片方だけ
// 直す事故は起きる。共通部分は docs/shared/<name>.md に 1 つだけ置き、両パッケージの
// docs/ の <!-- shared:<name> --> … <!-- /shared:<name> --> をそれで書き換える。
// どの文書に置くかはパッケージごとに違ってよいが、1 つのパッケージには必ず 1 回だけ置く。
// `--check` は書き換えずに差分があれば失敗する（CI 用）。
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const here = path.dirname(new URL(import.meta.url).pathname);
const sharedDir = path.resolve(here, '../docs/shared');
const packages = ['static', 'server'].map((pkg) => {
  const docs = path.resolve(here, `../../${pkg}/docs`);
  return {
    docs,
    files: readdirSync(docs, { recursive: true, encoding: 'utf8' })
      .filter((file) => file.endsWith('.md'))
      .toSorted()
      .map((file) => path.join(docs, file)),
  };
});
const check = process.argv.includes('--check');

const fragments = new Map(
  readdirSync(sharedDir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => [
      file.slice(0, -'.md'.length),
      readFileSync(path.join(sharedDir, file), 'utf8'),
    ]),
);

let drift = 0;
for (const { docs, files } of packages) {
  const placed = new Map<string, string[]>();
  for (const file of files) {
    const before = readFileSync(file, 'utf8');
    const after = before.replaceAll(
      /<!-- shared:([\w-]+) -->\n[\s\S]*?<!-- \/shared:\1 -->\n/gu,
      (whole, name: string) => {
        const fragment = fragments.get(name);
        if (fragment === undefined) {
          throw new Error(`${file}: no docs/shared/${name}.md for the marker`);
        }
        placed.set(name, [...(placed.get(name) ?? []), file]);
        // 整形後の文書と同じ形にする: マーカーと本文の間に空行を 1 つ置く
        return `<!-- shared:${name} -->\n\n${fragment}\n<!-- /shared:${name} -->\n`;
      },
    );
    if (after === before) continue;
    if (check) {
      drift += 1;
      console.error(
        `${path.relative(process.cwd(), file)} differs from docs/shared — run \`pnpm --filter @k8ordo/framework-engine check:write\``,
      );
    } else {
      writeFileSync(file, after);
      console.warn(`synced ${path.relative(process.cwd(), file)}`);
    }
  }
  for (const name of fragments.keys()) {
    const at = placed.get(name) ?? [];
    if (at.length !== 1) {
      throw new Error(
        `${path.relative(process.cwd(), docs)}: <!-- shared:${name} --> must appear exactly once, found ${String(at.length)}${at.length > 0 ? ` (${at.map((file) => path.relative(docs, file)).join(', ')})` : ''}`,
      );
    }
  }
}
if (drift > 0) process.exit(1);
