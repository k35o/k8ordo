import type { Message } from '@k8ordo/i18n';
import { Heading } from '@k8ordo/ui';
import type { ReactNode } from 'react';

import { Rich } from '../rich';

/** One paragraph of guide prose; a link may follow the text inside it. */
export function Paragraph({
  text,
  children,
}: {
  text: Message;
  children?: ReactNode;
}) {
  return (
    <p className="text-fg-mute leading-relaxed">
      <Rich>{text()}</Rich>
      {children === undefined || children === null ? null : <> {children}</>}
    </p>
  );
}

/** A heading below a section's h2. */
export function SubHeading({ text }: { text: Message }) {
  return (
    <Heading level="h3">
      <Rich>{text()}</Rich>
    </Heading>
  );
}

export function Bullets({ children }: { children: ReactNode }) {
  return <ul className="text-fg-mute flex flex-col gap-2 pl-6">{children}</ul>;
}

export function Bullet({ children }: { children: ReactNode }) {
  return <li className="list-disc leading-relaxed">{children}</li>;
}

/** A reference table: the head is messages, the body is `Row`s of `Cell`s. */
export function GuideTable({
  head,
  children,
}: {
  head: readonly Message[];
  children: ReactNode;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-border-mute border-b">
            {head.map((column) => (
              <th
                className="py-3 pr-6 font-medium whitespace-nowrap"
                key={column()}
              >
                <Rich>{column()}</Rich>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-fg-mute">{children}</tbody>
      </table>
    </div>
  );
}

export function Row({ children }: { children: ReactNode }) {
  return <tr className="border-border-mute border-b align-top">{children}</tr>;
}

export function Cell({
  children,
  nowrap = false,
}: {
  children: ReactNode;
  nowrap?: boolean;
}) {
  return (
    <td
      className={
        nowrap
          ? 'py-3 pr-6 whitespace-nowrap'
          : 'py-3 pr-6 leading-relaxed wrap-break-word'
      }
    >
      {children}
    </td>
  );
}
