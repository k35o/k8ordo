'use client';

import { Button } from '@k8ordo/ui';
import type { ComponentProps, ReactNode } from 'react';

type Props = {
  href: string;
  /** Opens in a new tab with the usual rel. */
  external?: boolean;
  color?: ComponentProps<typeof Button>['color'];
  variant?: ComponentProps<typeof Button>['variant'];
  startIcon?: ReactNode;
  children: ReactNode;
};

/**
 * Button の見た目で描く <a>。`renderItem` は関数なので Server Component からは
 * 渡せない。ここで閉じておけば、ランディングは Server Component のまま
 * href と文言（文字列）だけを渡せる。
 */
export function LinkButton({
  href,
  external = false,
  color,
  variant = 'skeleton',
  startIcon,
  children,
}: Props) {
  return (
    <Button
      color={color}
      renderItem={({ className, children: label }) => (
        <a
          className={className}
          href={href}
          rel={external ? 'noopener noreferrer' : undefined}
          target={external ? '_blank' : undefined}
        >
          {label}
        </a>
      )}
      size="md"
      startIcon={startIcon}
      variant={variant}
    >
      {children}
    </Button>
  );
}
