'use client';

import { useId, useRef } from 'react';
import type { FC, PropsWithChildren, ReactNode } from 'react';

import { cn } from '../../../helpers/cn';
import { useMessages } from '../../../i18n/context';
import type { DrawerSide } from '../../../types/variables';
import { IconButton } from '../../buttons/icon-button';
import { Heading } from '../../data-display/heading';
import { CloseIcon } from '../../icons';
import { Modal } from '../modal';

export const Drawer: FC<
  PropsWithChildren<{
    title: ReactNode;
    isOpen?: boolean;
    defaultOpen?: boolean;
    onClose?: () => void;
    side?: DrawerSide;
  }>
> = ({ title, isOpen, defaultOpen, onClose, side = 'right', children }) => {
  const messages = useMessages();
  const rootId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <Modal
      aria-describedby={`${rootId}-content`}
      aria-labelledby={`${rootId}-title`}
      defaultOpen={defaultOpen}
      isOpen={isOpen}
      onClose={onClose}
      ref={dialogRef}
      side={side}
    >
      {/* section にすると名前付き region ランドマークになるため div。
          名前は外側の <dialog> が aria-labelledby で受け持つ */}
      <div className="vertical:flex-row flex h-full flex-col" id={rootId}>
        <div className="flex shrink-0 items-center justify-center p-4 pb-2">
          {typeof title === 'string' ? (
            <Heading id={`${rootId}-title`} level="h3">
              {title}
            </Heading>
          ) : (
            // labelledby の参照先 id を持たせつつ flex レイアウトに影響させないための contents ラッパー
            <div className="contents" id={`${rootId}-title`}>
              {title}
            </div>
          )}
          <div
            className={cn(
              'absolute top-2',
              side === 'left' ? 'left-2' : 'right-2',
            )}
          >
            <IconButton
              label={messages.close}
              onClick={(e) => {
                e.stopPropagation();
                dialogRef.current?.close();
              }}
              tooltipDisabled
            >
              <CloseIcon size="sm" />
            </IconButton>
          </div>
        </div>
        {/* バックドロップクリックでの閉じる挙動を内側で止めるためだけの onClick */}
        {/* (キーボード操作は Drawer の Escape ハンドラが担う) */}
        {/* oxlint-disable eslint-plugin-jsx-a11y/click-events-have-key-events, eslint-plugin-jsx-a11y/no-static-element-interactions */}
        <div
          className="flex-1 overflow-y-auto overscroll-contain p-4"
          id={`${rootId}-content`}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {children}
        </div>
        {/* oxlint-enable eslint-plugin-jsx-a11y/click-events-have-key-events, eslint-plugin-jsx-a11y/no-static-element-interactions */}
      </div>
    </Modal>
  );
};
