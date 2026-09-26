import type {
  ComponentProps,
  FC,
  HTMLAttributes,
  PropsWithChildren,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from 'react';

import { cn } from '../../../helpers/cn';
import { EmptyState } from '../../feedback/empty-state';

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

const Root: FC<RootProps> = ({ children, ...rest }) => (
  <div className="border-border-mute bg-bg-base vertical:writing-sideways-rl vertical:size-fit w-full overflow-x-auto rounded-lg border">
    <table {...rest} className="min-w-full border-collapse text-left text-sm">
      {children}
    </table>
  </div>
);

const Head: FC<SectionProps> = ({ children, ...rest }) => (
  <thead {...rest} className="bg-bg-subtle">
    {children}
  </thead>
);

const Body: FC<SectionProps> = ({ children, ...rest }) => (
  <tbody
    {...rest}
    className="vertical:[&_tr:last-child]:border-l-0 [&_tr:last-child]:border-b-0"
  >
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
    className={cn(
      'border-border-mute border-b transition-colors vertical:border-b-0 vertical:border-l',
      interactive && 'hover:bg-bg-mute',
      selected &&
        'bg-primary-bg-subtle forced-colors:bg-[Highlight] forced-colors:text-[HighlightText]',
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
  <th
    {...rest}
    className={cn(
      'px-4 py-3 font-medium text-fg-base',
      align === 'center' && 'text-center',
      align === 'right' && 'text-right',
    )}
    scope={scope}
  >
    {children}
  </th>
);

const Cell: FC<CellProps> = ({
  align = 'left',
  children,
  color = 'base',
  ...rest
}) => (
  <td
    {...rest}
    className={cn(
      'px-4 py-3 align-middle',
      color === 'mute' ? 'text-fg-mute' : 'text-fg-base',
      align === 'center' && 'text-center',
      align === 'right' && 'text-right',
    )}
  >
    {children}
  </td>
);

const Caption: FC<CaptionProps> = ({ children, ...rest }) => (
  <caption {...rest} className="text-fg-mute caption-bottom px-4 py-3 text-sm">
    {children}
  </caption>
);

// 空の見た目は EmptyState が持つ。ここは表の中に置くための行とセルだけ
const EmptyRow: FC<EmptyRowProps> = ({ colSpan, ...rest }) => (
  <tr className="border-border-mute border-b">
    <td className="align-middle" colSpan={colSpan}>
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
