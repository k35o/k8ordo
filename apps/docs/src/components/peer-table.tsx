import type { Message } from '@k8ordo/i18n';
import { Code } from '@k8ordo/ui';

import { peersOf } from '../data/peers';
import * as m from '../messages';
import { Rich } from './rich';

type PeerTableProps = {
  /** The published name, e.g. `@k8ordo/router`. */
  name: string;
  /** What each peer is needed for, keyed by the peer's name. */
  neededFor: Readonly<Record<string, Message>>;
};

/**
 * A package's peer dependencies. The versions and which of them are optional
 * come from the package's README, which is generated from its `package.json`;
 * only what each is needed for is written on the site. A peer without a
 * message, or a message for something that is not a peer, fails the render.
 */
export function PeerTable({ name, neededFor }: PeerTableProps) {
  const peers = peersOf(name);
  const stale = Object.keys(neededFor).filter(
    (peer) => !peers.some((entry) => entry.name === peer),
  );
  if (stale.length > 0) {
    throw new Error(
      `${name}: neededFor names ${stale.join(', ')}, which its README does not list as a peer`,
    );
  }
  const unexplained = peers.filter((peer) => !(peer.name in neededFor));
  if (unexplained.length > 0) {
    throw new Error(
      `${name}: no neededFor message for its peer ${unexplained.map((peer) => peer.name).join(', ')}`,
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-border-mute border-b">
            <th className="py-3 pr-6 font-medium whitespace-nowrap">
              {m.peers.packageColumn()}
            </th>
            <th className="py-3 pr-6 font-medium whitespace-nowrap">
              {m.peers.versionColumn()}
            </th>
            <th className="py-3 pr-6 font-medium whitespace-nowrap">
              {m.peers.requiredColumn()}
            </th>
            <th className="py-3 font-medium whitespace-nowrap">
              {m.peers.neededForColumn()}
            </th>
          </tr>
        </thead>
        <tbody className="text-fg-mute">
          {peers.map((peer) => (
            <tr className="border-border-mute border-b" key={peer.name}>
              <td className="py-3 pr-6 align-top whitespace-nowrap">
                <Code>{peer.name}</Code>
              </td>
              <td className="py-3 pr-6 align-top whitespace-nowrap">
                {peer.version}
              </td>
              <td className="py-3 pr-6 align-top whitespace-nowrap">
                {peer.optional ? m.peers.optional() : m.peers.required()}
              </td>
              <td className="py-3 align-top">
                <Rich>{neededFor[peer.name]()}</Rich>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
