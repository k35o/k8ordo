import { CodeBlock } from '@k8ordo/ui/code-block';

import { nodeOf, peersOf } from '../data/peers';
import * as m from '../messages';
import { InstallTabs } from './install-tabs';
import { Rich } from './rich';

/** The same packages as `npm install`, `pnpm add` and `yarn add`, in tabs. */
export function InstallCommand({ packages }: { packages: string }) {
  return (
    <InstallTabs
      npm={<CodeBlock code={`npm install ${packages}`} lang="bash" />}
      pnpm={<CodeBlock code={`pnpm add ${packages}`} lang="bash" />}
      yarn={<CodeBlock code={`yarn add ${packages}`} lang="bash" />}
    />
  );
}

// アプリがすでに持っているもの。インストールのコマンドには並べず、動く環境に書く
const HOST = new Set(['react', 'react-dom', 'vite']);

// README の範囲（`≥19.3.0`）と engines（`>=24.0.0`）から下限だけを取り出し、
// 末尾の `.0` を落として `19.3`、`24` のように人が書く形にする。上限のある
// 範囲は「以上」と書けないので、ここで止めて書き方を考え直させる
const lowerBound = (name: string, range: string): string => {
  const bound = /^(?:≥|>=)(?<version>\d+\.\d+\.\d+)$/u.exec(range)?.groups
    ?.version;
  if (bound === undefined) {
    throw new Error(
      `${name}: ${range} is not a bare lower bound, which the requirements list can say`,
    );
  }
  return bound.replace(/(?:\.0)+$/u, '');
};

/** The lower bound of one of a `@k8ordo/*` package's peers, e.g. `4.3.3` or `19.3`. */
export const peerVersionOf = (name: string, peer: string): string => {
  const range = peersOf(name).find((entry) => entry.name === peer)?.version;
  if (range === undefined) {
    throw new Error(`${name}: ${peer} is not one of its peers`);
  }
  return lowerBound(peer, range);
};

/**
 * The minor series a 0.x peer is pinned to, e.g. `0.21.x` for
 * `≥0.21.0 <0.22.0`. Any other shape of range fails the build.
 */
export const peerSeriesOf = (name: string, peer: string): string => {
  const range = peersOf(name).find((entry) => entry.name === peer)?.version;
  const series = /^≥(?<minor>0\.\d+)\.\d+ <0\.\d+\.0$/u.exec(range ?? '')
    ?.groups?.minor;
  if (series === undefined) {
    throw new Error(
      `${name}: ${peer}'s range ${String(range)} is not one 0.x minor series`,
    );
  }
  return `${series}.x`;
};

/**
 * What a `@k8ordo/*` package runs with: React, Vite, Node.js and TypeScript,
 * as far as it declares them. The versions are read from its README's peer
 * table and its `engines`, never written on the site. `react-dom` goes with
 * React, and the `@types/*` peers with TypeScript, so neither gets a line.
 */
export function Requirements({ name }: { name: string }) {
  const peers = peersOf(name);
  const versionOf = (peer: string): string | undefined =>
    peers.some((entry) => entry.name === peer)
      ? peerVersionOf(name, peer)
      : undefined;
  const node = nodeOf(name);
  const items = [
    ['react', versionOf('react'), m.install.react],
    ['vite', versionOf('vite'), m.install.vite],
    [
      'node',
      node === undefined ? undefined : lowerBound('node', node),
      m.install.node,
    ],
    ['typescript', versionOf('typescript'), m.install.typescript],
  ] as const;

  return (
    <>
      <p>{m.install.requirements()}</p>
      <ul>
        {items.map(([key, version, say]) =>
          version === undefined ? null : <li key={key}>{say(version)}</li>,
        )}
      </ul>
    </>
  );
}

/**
 * The install command of a `@k8ordo/*` package and what it runs with. The
 * command adds the package's required peers, apart from what the application
 * already has (React, Vite); an optional peer belongs on the page of the
 * feature that needs it.
 */
export function PackageInstall({ name }: { name: string }) {
  const required = peersOf(name)
    .filter((peer) => !peer.optional && !HOST.has(peer.name))
    .map((peer) => peer.name);

  return (
    <>
      <InstallCommand packages={[name, ...required].join(' ')} />
      <Requirements name={name} />
      <p>
        <Rich>{m.install.agentDocs(name)}</Rich>
      </p>
    </>
  );
}
