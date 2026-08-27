'use client';

import type { FC, HTMLAttributes, ReactNode } from 'react';
import { useState } from 'react';

import { cn } from '../../../helpers/cn';
import { useMessages } from '../../../i18n/context';

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
  const messages = useMessages();
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = Boolean(src) && failedSrc !== src;
  const label = alt ?? name ?? messages.avatar;
  const imageSize = size === 'sm' ? 32 : size === 'md' ? 40 : 56;

  return (
    <span
      {...rest}
      aria-label={label}
      className={cn(
        'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border font-medium',
        color === 'base' && 'border-border-base bg-bg-mute text-fg-base',
        color === 'primary' &&
          'border-transparent bg-primary-bg text-primary-fg',
        color === 'secondary' &&
          'border-transparent bg-secondary-bg text-secondary-fg',
        size === 'sm' && 'size-8 text-xs',
        size === 'md' && 'size-10 text-sm',
        size === 'lg' && 'size-14 text-lg',
      )}
      role="img"
    >
      {showImage ? (
        <img
          alt={alt ?? ''}
          className="size-full object-cover"
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
        <span
          aria-hidden
          className={cn(
            'flex items-center justify-center',
            // アイコンをアバターより一回り小さく揃え、常に程よい余白を確保する。
            size === 'sm' && '[&_svg]:size-5',
            size === 'md' && '[&_svg]:size-6',
            size === 'lg' && '[&_svg]:size-8',
          )}
        >
          {icon}
        </span>
      )}
    </span>
  );
};
