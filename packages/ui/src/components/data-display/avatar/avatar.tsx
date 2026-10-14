'use client';

import { clsx } from 'clsx';
import type { FC, HTMLAttributes, ReactNode } from 'react';
import { useState } from 'react';

import { getMessages } from '../../../i18n/current';

import styles from './avatar.module.css';

type Props = {
  alt?: string;
  color?: 'base' | 'primary' | 'secondary';
  fallback?: string;
  icon?: ReactNode;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  src?: string;
} & Omit<
  HTMLAttributes<HTMLSpanElement>,
  'role' | 'aria-label' | 'className' | 'style'
>;

const COLOR = {
  base: styles.base,
  primary: styles.primary,
  secondary: styles.secondary,
} as const;

const SIZE = { sm: styles.sm, md: styles.md, lg: styles.lg } as const;

const ICON_SIZE = {
  sm: styles.iconSm,
  md: styles.iconMd,
  lg: styles.iconLg,
} as const;

const getInitials = (name?: string) => {
  if (name === undefined || name === '') {
    return '?';
  }

  const initials = name
    .trim()
    .split(/\s+/u)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

  return initials === '' ? '?' : initials;
};

export const Avatar: FC<Props> = ({
  alt,
  color = 'base',
  fallback,
  icon,
  name,
  size = 'md',
  src,
  ...rest
}) => {
  const messages = getMessages();
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = Boolean(src) && failedSrc !== src;
  const label = alt ?? name ?? messages.avatar;
  const imageSize = size === 'sm' ? 32 : size === 'md' ? 40 : 56;

  return (
    <span
      {...rest}
      aria-label={label}
      className={clsx(styles.root, COLOR[color], SIZE[size])}
      role="img"
    >
      {showImage ? (
        <img
          alt={alt ?? ''}
          className={styles.image}
          height={imageSize}
          onError={() => {
            setFailedSrc(src ?? null);
          }}
          src={src}
          width={imageSize}
        />
      ) : icon === undefined ? (
        <span aria-hidden>{fallback ?? getInitials(name)}</span>
      ) : (
        <span aria-hidden className={clsx(styles.icon, ICON_SIZE[size])}>
          {icon}
        </span>
      )}
    </span>
  );
};
