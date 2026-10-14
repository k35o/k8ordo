import { Code } from '@k8ordo/ui';
import type { FC } from 'react';

import * as m from '../messages';
import { LocaleAnchor } from './locale-anchor';
import { Rich } from './rich';

import styles from './props-table.module.css';

export type PropItem = {
  name: string;
  types: readonly string[];
  defaultValue: string | null;
};

const TypeCodes: FC<{ types: readonly string[] }> = ({ types }) => (
  <span className={styles.types}>
    {types.map((type, i) => (
      <span className={styles.type} key={type}>
        {i > 0 && <span className={styles.subtle}>|</span>}
        <Code>{type}</Code>
      </span>
    ))}
  </span>
);

const DefaultValue: FC<{ value: string | null }> = ({ value }) =>
  value !== null && value !== '' ? <Code>{value}</Code> : <>-</>;

export const PropsTable: FC<{
  items: readonly PropItem[];
  inherits?: string;
  /** 組み込みの文言を文言辞書から引くコンポーネントで、辞書の説明へ導く */
  messagesNote?: boolean;
}> = ({ items, inherits, messagesNote = false }) => (
  <div className={styles.root}>
    <dl className={styles.list}>
      {items.map((prop) => (
        <div className={styles.item} key={prop.name}>
          <dt className={styles.name}>
            <Code>{prop.name}</Code>
          </dt>
          <dd className={styles.detail}>
            <span className={styles.subtle}>Type: </span>
            <TypeCodes types={prop.types} />
          </dd>
          <dd className={styles.detail}>
            <span className={styles.subtle}>Default: </span>
            <DefaultValue value={prop.defaultValue} />
          </dd>
        </div>
      ))}
    </dl>
    <table className={styles.table}>
      <thead>
        <tr className={styles.row}>
          <th className={styles.headerCell}>Prop</th>
          <th className={styles.headerCell}>Type</th>
          <th className={styles.lastHeaderCell}>Default</th>
        </tr>
      </thead>
      <tbody className={styles.body}>
        {items.map((prop) => (
          <tr className={styles.row} key={prop.name}>
            <td className={styles.nameCell}>
              <Code>{prop.name}</Code>
            </td>
            <td className={styles.typeCell}>
              <TypeCodes types={prop.types} />
            </td>
            <td className={styles.defaultCell}>
              <DefaultValue value={prop.defaultValue} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    {inherits !== undefined && inherits !== '' ? (
      <p className={styles.note}>
        <Rich>{m.components.common.inheritsLabel()}</Rich>{' '}
        <Code>{inherits}</Code>
      </p>
    ) : null}
    {messagesNote ? (
      <p className={styles.note}>
        <Rich>{m.components.common.messagesNote()}</Rich>{' '}
        <LocaleAnchor path="/:locale/ui/i18n">
          <Rich>{m.nav.i18n()}</Rich>
        </LocaleAnchor>
      </p>
    ) : null}
  </div>
);
