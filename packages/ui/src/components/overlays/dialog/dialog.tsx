'use client';

import { useEffect, useId, useMemo } from 'react';
import type { FC, PropsWithChildren, Ref, ReactNode } from 'react';

import { useMessages } from '../../../i18n/context';
import { IconButton } from '../../buttons/icon-button';
import { Heading } from '../../data-display/heading';
import { CloseIcon } from '../../icons';
import { useModalDialogContext } from '../_internal/modal-dialog-context';
import { createSafeContext } from './../../../helpers/create-safe-context';

const [DialogContext, useDialogContext] = createSafeContext<{
  rootId: string;
}>('useDialogContext must be used within a DialogProvider');

const Root: FC<
  PropsWithChildren<{
    ref?: Ref<HTMLElement> | undefined;
    id?: string | undefined;
    tabIndex?: number | undefined;
    role?: 'dialog' | 'alertdialog' | undefined;
  }>
> = ({ ref, id, children, tabIndex, role }) => {
  const fallbackId = useId();
  const rootId = id ?? fallbackId;
  const contextValue = useMemo(() => ({ rootId }), [rootId]);
  const modal = useModalDialogContext();

  // Modal 配下では外側の <dialog> が dialog ロールを持つため、ここでは role を出さない。
  // 名前を持つ role なし section は region ランドマークになるので、
  // aria-labelledby / aria-describedby も role とセットで出す。
  const resolvedRole = role ?? (modal === null ? 'dialog' : undefined);
  const labelledBy = resolvedRole === undefined ? undefined : `${rootId}-title`;
  const describedBy =
    resolvedRole === undefined ? undefined : `${rootId}-content`;

  // 自分の role を外した場合だけ、名前付けの責務を祖先の Modal へ委譲する。
  // 参照 id を持つのは子（Header / Content）を描画するこの階層なので、
  // 祖先の state へは effect でしか渡せない。
  useEffect(() => {
    if (modal === null || resolvedRole !== undefined) {
      return undefined;
    }
    modal.registerLabelledBy(`${rootId}-title`);
    modal.registerDescribedBy(`${rootId}-content`);
    return () => {
      modal.registerLabelledBy(undefined);
      modal.registerDescribedBy(undefined);
    };
  }, [modal, resolvedRole, rootId]);

  return (
    <section
      aria-describedby={describedBy}
      aria-labelledby={labelledBy}
      className="bg-bg-raised relative w-full rounded-lg shadow-md"
      id={id}
      ref={ref}
      role={resolvedRole}
      tabIndex={tabIndex}
    >
      <DialogContext value={contextValue}>{children}</DialogContext>
    </section>
  );
};

const Header: FC<{
  title: ReactNode;
  onClose: () => void;
}> = ({ title, onClose }) => {
  const messages = useMessages();
  const { rootId } = useDialogContext();
  return (
    <div className="flex items-center justify-center p-4 pb-2">
      <Heading id={`${rootId}-title`} level="h3">
        {title}
      </Heading>
      <div className="absolute top-2 right-2">
        <IconButton
          label={messages.close}
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          tooltipDisabled
        >
          <CloseIcon size="sm" />
        </IconButton>
      </div>
    </div>
  );
};

const Content: FC<PropsWithChildren> = ({ children }) => {
  const { rootId } = useDialogContext();
  return (
    // バックドロップクリックでの閉じる挙動を内側で止めるためだけの onClick
    // (キーボード操作は Modal の Escape ハンドラが担う)
    /* oxlint-disable eslint-plugin-jsx-a11y/click-events-have-key-events, eslint-plugin-jsx-a11y/no-static-element-interactions */
    <div
      className="p-4"
      id={`${rootId}-content`}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {children}
    </div>
    /* oxlint-enable eslint-plugin-jsx-a11y/click-events-have-key-events, eslint-plugin-jsx-a11y/no-static-element-interactions */
  );
};

export const Dialog = {
  Root,
  Header,
  Content,
} as const;
