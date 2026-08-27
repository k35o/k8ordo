import type { ButtonHTMLAttributes, FC, HTMLAttributes } from 'react';

import { cn } from '../../../helpers/cn';
import { FOCUS_RING_NO_BORDER } from '../../_internal/focus-ring';

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

const badgeClassName = (
  size: Size,
  tone: Tone,
  variant: Variant,
  interactive: boolean,
): string => {
  const interactiveClassName = cn(
    interactive && `cursor-pointer ${FOCUS_RING_NO_BORDER}`,
    interactive &&
      tone === 'neutral' &&
      variant === 'solid' &&
      'hover:bg-bg-emphasize active:bg-bg-base',
    interactive &&
      tone === 'neutral' &&
      variant === 'outline' &&
      'hover:bg-bg-subtle active:bg-bg-mute',
    interactive &&
      tone === 'info' &&
      variant === 'solid' &&
      'hover:bg-bg-info/80 active:bg-bg-info/60',
    interactive &&
      tone === 'info' &&
      variant === 'outline' &&
      'hover:bg-bg-info active:bg-bg-info/80',
    interactive &&
      tone === 'success' &&
      variant === 'solid' &&
      'hover:bg-bg-success/80 active:bg-bg-success/60',
    interactive &&
      tone === 'success' &&
      variant === 'outline' &&
      'hover:bg-bg-success active:bg-bg-success/80',
    interactive &&
      tone === 'warning' &&
      variant === 'solid' &&
      'hover:bg-bg-warning/80 active:bg-bg-warning/60',
    interactive &&
      tone === 'warning' &&
      variant === 'outline' &&
      'hover:bg-bg-warning active:bg-bg-warning/80',
    interactive &&
      tone === 'error' &&
      variant === 'solid' &&
      'hover:bg-bg-error/80 active:bg-bg-error/60',
    interactive &&
      tone === 'error' &&
      variant === 'outline' &&
      'hover:bg-bg-error active:bg-bg-error/80',
  );

  return cn(
    'inline-flex items-center rounded-full border font-medium transition-colors',
    size === 'sm' && 'px-2 py-0.5 text-xs',
    size === 'md' && 'px-2.5 py-1 text-xs',
    size === 'lg' && 'px-3 py-1.5 text-sm',
    tone === 'neutral' &&
      variant === 'solid' &&
      'border-border-mute bg-bg-mute text-fg-base',
    tone === 'neutral' &&
      variant === 'outline' &&
      'border-border-base bg-bg-base text-fg-base',
    tone === 'info' &&
      variant === 'solid' &&
      'border-border-info bg-bg-info text-fg-info',
    tone === 'info' &&
      variant === 'outline' &&
      'border-border-info bg-bg-base text-fg-info',
    tone === 'success' &&
      variant === 'solid' &&
      'border-border-success bg-bg-success text-fg-success',
    tone === 'success' &&
      variant === 'outline' &&
      'border-border-success bg-bg-base text-fg-success',
    tone === 'warning' &&
      variant === 'solid' &&
      'border-border-warning bg-bg-warning text-fg-warning',
    tone === 'warning' &&
      variant === 'outline' &&
      'border-border-warning bg-bg-base text-fg-warning',
    tone === 'error' &&
      variant === 'solid' &&
      'border-border-error bg-bg-error text-fg-error',
    tone === 'error' &&
      variant === 'outline' &&
      'border-border-error bg-bg-base text-fg-error',
    interactiveClassName,
  );
};

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
