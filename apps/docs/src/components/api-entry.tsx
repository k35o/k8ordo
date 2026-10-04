import type { Message } from '@k8ordo/i18n';
import { Code, Prose } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';
import type { ReactNode } from 'react';

import * as m from '../messages';
import { Rich } from './rich';

type Param = { name: string; type: string; description: Message };

/** One named thing with a type: a parameter, or a field of what is returned. */
const NamedList = ({ items }: { items: readonly Param[] }) => (
  <dl className="flex flex-col gap-3">
    {items.map((item) => (
      <div className="flex flex-col gap-1" key={item.name}>
        <dt className="flex flex-wrap items-baseline gap-2">
          <Code>{item.name}</Code>
          <span className="text-fg-mute text-sm">{item.type}</span>
        </dt>
        <dd className="text-fg-base leading-relaxed">
          <Rich>{item.description()}</Rich>
        </dd>
      </div>
    ))}
  </dl>
);

export type ApiEntryProps = {
  /** The anchor, the same in every locale. */
  id: string;
  /** The exported name, as it is imported. */
  name: string;
  /** The entry point it is imported from. */
  from: string;
  summary: Message;
  signature: string;
  params?: readonly Param[];
  returns?: { type: string; description: Message };
  /** The fields of a type, or of the object a function returns. */
  fields?: readonly Param[];
  caveats?: readonly Message[];
  /** An example, or anything else that belongs to this entry. */
  children?: ReactNode;
};

const Label = ({ children }: { children: string }) => (
  <h3 className="text-fg-base text-sm font-bold">{children}</h3>
);

/**
 * One exported function or type, laid out the same way every time: what it
 * is, how it is called, what it takes, what it gives back, and what to watch.
 */
export function ApiEntry({
  id,
  name,
  from,
  summary,
  signature,
  params,
  returns,
  fields,
  caveats,
  children,
}: ApiEntryProps) {
  return (
    <section
      aria-labelledby={id}
      className="border-border-mute flex flex-col gap-5 border-t pt-10"
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold md:text-2xl" id={id}>
          {name}
        </h2>
        <p className="text-fg-mute text-sm">
          {m.reference.importFrom()} <Code>{from}</Code>
        </p>
      </div>
      <Prose>
        <p>
          <Rich>{summary()}</Rich>
        </p>
      </Prose>
      <CodeBlock code={signature} lang="ts" />
      {params !== undefined && params.length > 0 && (
        <div className="flex flex-col gap-3">
          <Label>{m.reference.parameters()}</Label>
          <NamedList items={params} />
        </div>
      )}
      {returns !== undefined && (
        <div className="flex flex-col gap-3">
          <Label>{m.reference.returns()}</Label>
          <p className="leading-relaxed">
            <Code>{returns.type}</Code> — <Rich>{returns.description()}</Rich>
          </p>
        </div>
      )}
      {fields !== undefined && fields.length > 0 && (
        <div className="flex flex-col gap-3">
          <Label>{m.reference.fields()}</Label>
          <NamedList items={fields} />
        </div>
      )}
      {caveats !== undefined && caveats.length > 0 && (
        <div className="flex flex-col gap-3">
          <Label>{m.reference.caveats()}</Label>
          <ul className="text-fg-base flex list-disc flex-col gap-2 ps-5 leading-relaxed">
            {caveats.map((caveat) => (
              <li key={caveat()}>
                <Rich>{caveat()}</Rich>
              </li>
            ))}
          </ul>
        </div>
      )}
      {children}
    </section>
  );
}
