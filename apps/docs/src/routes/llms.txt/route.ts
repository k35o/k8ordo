import type { RouteContext } from '@k8ordo/router';

import { PACKAGES } from '../../data/packages';
import { docsPathOf, shipsDocs } from '../../data/shipped-docs';
import type { Manifest } from '../../data/shipped-docs';

const manifests = import.meta.glob<Manifest>(
  '../../../../../packages/*/package.json',
  { eager: true, import: 'default' },
);
const indexes = import.meta.glob<string>(
  '../../../../../packages/*/docs/llms.txt',
  { eager: true, import: 'default', query: '?raw' },
);

const siteIndex = (name: string, raw: string, origin: string): string => {
  const npmNote = `When installed via npm, these docs live under \`node_modules/${name}/docs/\`.`;
  if (!raw.includes(npmNote)) {
    throw new Error(
      `${name}'s docs/llms.txt no longer says "${npmNote}", which /llms.txt replaces with where the site serves it`,
    );
  }
  const base = `${origin}${docsPathOf(name)}`;
  const section = raw
    .replace(npmNote, `These docs are served from <${origin}>.`)
    // npm では手元のファイル名で案内し、サイトでは下に並ぶリンクの名前で案内する
    .replace('Start with GUIDE.md,', 'Start with the Design Guide,')
    .replaceAll(/\]\(([^)]+)\)/gu, (link, target: string) => {
      if (/^https?:/u.test(target)) return link;
      const url = new URL(target, base);
      if (!url.pathname.endsWith('.md')) {
        throw new Error(
          `${name}'s docs/llms.txt links "${target}", but the site serves only the markdown in docs/`,
        );
      }
      return `](${url.href})`;
    })
    .trimEnd();
  // 言い回しが変わって上の置き換えが空振りしても、黙ってファイル名の案内を残さない
  if (/(?<![[/])GUIDE\.md/u.test(section)) {
    throw new Error(
      `${name}'s docs/llms.txt names GUIDE.md outside a link, and /llms.txt only knows to reword "Start with GUIDE.md,"`,
    );
  }
  return section;
};

// サイトの URL は書かない。ビルドは site（vite.config.ts）を origin にした request で呼ぶ
export function GET({ request }: RouteContext<'/llms.txt'>) {
  const { origin } = new URL(request.url);
  const shipped = new Map(
    Object.entries(manifests)
      .filter(([, manifest]) => shipsDocs(manifest))
      .map(([path, manifest]) => [
        manifest.name,
        indexes[path.replace(/package\.json$/u, 'docs/llms.txt')],
      ]),
  );
  const unlisted = [...shipped.keys()].filter(
    (name) => !PACKAGES.some((entry) => entry.name === name),
  );
  if (unlisted.length > 0) {
    throw new Error(
      `PACKAGES (src/data/packages.ts) is missing ${unlisted.join(', ')} — every package that ships docs/ has its pages on the site`,
    );
  }
  const sections = PACKAGES.map(({ name }) => {
    const raw = shipped.get(name);
    if (raw === undefined) {
      throw new Error(
        `${name} is in PACKAGES but ships no docs/llms.txt for /llms.txt to list`,
      );
    }
    return siteIndex(name, raw, origin);
  });
  return new Response(`${sections.join('\n\n---\n\n')}\n`, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
