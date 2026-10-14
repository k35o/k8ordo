import type { Message } from '@k8ordo/i18n';
import { Code, Prose } from '@k8ordo/ui';
import type { ReactNode } from 'react';

import * as m from '../messages';
import { CodeBlock } from './code-block';
import { Rich } from './rich';

import styles from './api-entry.module.css';

type Param = { name: string; type: string; description: Message };

/** One named thing with a type: a parameter, or a field of what is returned. */
const NamedList = ({ items }: { items: readonly Param[] }) => (
  <dl className={styles.list}>
    {items.map((item) => (
      <div className={styles.item} key={item.name}>
        <dt className={styles.term}>
          <Code>{item.name}</Code>
          <span className={styles.type}>{item.type}</span>
        </dt>
        <dd className={styles.description}>
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
  <h3 className={styles.label}>{children}</h3>
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
    <section aria-labelledby={id} className={styles.entry}>
      <div className={styles.heading}>
        <h2 className={styles.name} id={id}>
          {name}
        </h2>
        <p className={styles.from}>
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
        <div className={styles.block}>
          <Label>{m.reference.parameters()}</Label>
          <NamedList items={params} />
        </div>
      )}
      {returns !== undefined && (
        <div className={styles.block}>
          <Label>{m.reference.returns()}</Label>
          <p className={styles.returns}>
            <Code>{returns.type}</Code> — <Rich>{returns.description()}</Rich>
          </p>
        </div>
      )}
      {fields !== undefined && fields.length > 0 && (
        <div className={styles.block}>
          <Label>{m.reference.fields()}</Label>
          <NamedList items={fields} />
        </div>
      )}
      {caveats !== undefined && caveats.length > 0 && (
        <div className={styles.block}>
          <Label>{m.reference.caveats()}</Label>
          <ul className={styles.caveats}>
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
