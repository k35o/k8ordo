import { clsx } from 'clsx';
import type {
  ComponentProps,
  FC,
  HTMLAttributes,
  PropsWithChildren,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from 'react';

import { EmptyState } from '../../feedback/empty-state';

import styles from './table.module.css';

type RootProps = PropsWithChildren<
  Omit<TableHTMLAttributes<HTMLTableElement>, 'className' | 'style'>
>;

type RowProps = PropsWithChildren<
  {
    interactive?: boolean;
    selected?: boolean;
  } & Omit<HTMLAttributes<HTMLTableRowElement>, 'className' | 'style'>
>;

export type CellAlign = 'left' | 'center' | 'right';

type HeaderCellProps = PropsWithChildren<
  {
    align?: CellAlign;
    scope?: 'col' | 'row' | 'colgroup' | 'rowgroup';
  } & Omit<
    ThHTMLAttributes<HTMLTableCellElement>,
    'className' | 'style' | 'align' | 'scope'
  >
>;

type CellProps = PropsWithChildren<
  {
    align?: CellAlign;
    color?: 'base' | 'mute';
  } & Omit<
    TdHTMLAttributes<HTMLTableCellElement>,
    'className' | 'style' | 'align'
  >
>;

type SectionProps = PropsWithChildren<
  Omit<HTMLAttributes<HTMLTableSectionElement>, 'className' | 'style'>
>;

type CaptionProps = PropsWithChildren<
  Omit<HTMLAttributes<HTMLTableCaptionElement>, 'className' | 'style'>
>;

type EmptyRowProps = {
  colSpan: number;
} & ComponentProps<typeof EmptyState>;

const ALIGN = {
  left: undefined,
  center: styles.center,
  right: styles.right,
} as const;

const COLOR = { base: styles.base, mute: styles.mute } as const;

const Root: FC<RootProps> = ({ children, ...rest }) => (
  <div className={styles.root}>
    <table {...rest} className={styles.table}>
      {children}
    </table>
  </div>
);

const Head: FC<SectionProps> = ({ children, ...rest }) => (
  <thead {...rest} className={styles.head}>
    {children}
  </thead>
);

const Body: FC<SectionProps> = ({ children, ...rest }) => (
  <tbody {...rest} className={styles.body}>
    {children}
  </tbody>
);

const Row: FC<RowProps> = ({
  children,
  interactive = false,
  selected = false,
  ...rest
}) => (
  <tr
    {...rest}
    className={clsx(
      styles.row,
      interactive && styles.interactive,
      selected && styles.selected,
    )}
  >
    {children}
  </tr>
);

const HeaderCell: FC<HeaderCellProps> = ({
  align = 'left',
  children,
  scope = 'col',
  ...rest
}) => (
  <th {...rest} className={clsx(styles.headerCell, ALIGN[align])} scope={scope}>
    {children}
  </th>
);

const Cell: FC<CellProps> = ({
  align = 'left',
  children,
  color = 'base',
  ...rest
}) => (
  <td {...rest} className={clsx(styles.cell, COLOR[color], ALIGN[align])}>
    {children}
  </td>
);

const Caption: FC<CaptionProps> = ({ children, ...rest }) => (
  <caption {...rest} className={styles.caption}>
    {children}
  </caption>
);

// 空の見た目は EmptyState が持つ。ここは表の中に置くための行とセルだけ
const EmptyRow: FC<EmptyRowProps> = ({ colSpan, ...rest }) => (
  <tr className={styles.emptyRow}>
    <td className={styles.emptyCell} colSpan={colSpan}>
      <EmptyState {...rest} />
    </td>
  </tr>
);

export const Table = {
  Root,
  Head,
  Body,
  Row,
  HeaderCell,
  Cell,
  Caption,
  EmptyState: EmptyRow,
} as const;
