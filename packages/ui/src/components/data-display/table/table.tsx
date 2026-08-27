import type {
  FC,
  HTMLAttributes,
  PropsWithChildren,
  ReactNode,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from 'react';

import { cn } from '../../../helpers/cn';

type RootProps = PropsWithChildren<
  Omit<TableHTMLAttributes<HTMLTableElement>, 'className' | 'style'>
>;

type RowProps = PropsWithChildren<
  {
    interactive?: boolean;
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

type EmptyStateProps = {
  colSpan: number;
  children: ReactNode;
};

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

const Row: FC<RowProps> = ({ children, interactive = false, ...rest }) => (
  <tr
    {...rest}
    className={cn(
      'border-border-mute border-b transition-colors vertical:border-b-0 vertical:border-l',
      interactive && 'hover:bg-bg-mute',
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

const EmptyState: FC<EmptyStateProps> = ({ children, colSpan }) => (
  <tr className="border-border-mute border-b transition-colors">
    <td
      className="text-fg-mute px-4 py-10 text-center align-middle"
      colSpan={colSpan}
    >
      {children}
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
  EmptyState,
} as const;
