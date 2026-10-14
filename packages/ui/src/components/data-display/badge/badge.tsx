import { clsx } from 'clsx';
import type { ButtonHTMLAttributes, FC, HTMLAttributes } from 'react';

import focusRing from '../../_internal/focus-ring.module.css';
import styles from './badge.module.css';

type Size = 'sm' | 'md' | 'lg';
type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'error';
type Variant = 'solid' | 'outline';

type BaseProps = {
  label: string;
  size?: Size;
  tone?: Tone;
  variant?: Variant;
};

type InteractiveProps = {
  interactive: true;
} & Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'className' | 'style' | 'type'
>;

type StaticProps = {
  interactive?: false;
} & Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'className' | 'style'>;

type Props = BaseProps & (InteractiveProps | StaticProps);

const SIZE = { sm: styles.sm, md: styles.md, lg: styles.lg } as const;

const TONE = {
  neutral: { solid: styles.neutralSolid, outline: styles.neutralOutline },
  info: { solid: styles.infoSolid, outline: styles.infoOutline },
  success: { solid: styles.successSolid, outline: styles.successOutline },
  warning: { solid: styles.warningSolid, outline: styles.warningOutline },
  error: { solid: styles.errorSolid, outline: styles.errorOutline },
} as const;

const badgeClassName = (
  size: Size,
  tone: Tone,
  variant: Variant,
  interactive: boolean,
): string =>
  clsx(
    styles.root,
    SIZE[size],
    TONE[tone][variant],
    interactive && [styles.interactive, focusRing.ringNoBorder],
  );

export const Badge: FC<Props> = (props) => {
  if (props.interactive === true) {
    const {
      interactive,
      label,
      size = 'md',
      tone = 'neutral',
      variant = 'solid',
      ...rest
    } = props;
    return (
      <button
        {...rest}
        className={badgeClassName(size, tone, variant, interactive)}
        type="button"
      >
        {label}
      </button>
    );
  }

  const {
    interactive = false,
    label,
    size = 'md',
    tone = 'neutral',
    variant = 'solid',
    ...rest
  } = props;
  return (
    <span
      {...rest}
      className={badgeClassName(size, tone, variant, interactive)}
    >
      {label}
    </span>
  );
};
