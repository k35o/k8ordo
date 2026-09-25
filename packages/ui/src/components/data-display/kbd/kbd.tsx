import type { FC, HTMLAttributes } from 'react';

type Props = {
  children: string;
  label?: string;
} & Omit<HTMLAttributes<HTMLElement>, 'children' | 'className' | 'style'>;

export const Kbd: FC<Props> = ({ children, label, ...rest }) => (
  <kbd
    {...rest}
    className="border-border-mute bg-bg-subtle text-fg-mute inline-flex min-w-6 items-center justify-center rounded-md border border-b-2 px-1.5 py-0.5 text-xs leading-none"
  >
    {label === undefined ? (
      children
    ) : (
      // 記号だけのキー（⌘ など）は読み上げで意味が通らないので、見た目は
      // 記号のまま、読み上げには label を渡す
      <>
        <span aria-hidden="true">{children}</span>
        <span className="sr-only">{label}</span>
      </>
    )}
  </kbd>
);
