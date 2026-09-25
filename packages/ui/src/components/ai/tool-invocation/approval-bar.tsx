'use client';

import { useCallback, useTransition } from 'react';
import type { FC } from 'react';

import { getMessages } from '../../../i18n/current';
import { Button } from '../../buttons/button';
import type { ToolApproval, ToolApprovalResponse } from '../types';

type Props = {
  approval: ToolApproval;
  nameId: string;
  triggerId: string;
  onApprovalResponse?: (
    response: ToolApprovalResponse,
  ) => void | PromiseLike<void>;
};

export const ApprovalBar: FC<Props> = ({
  approval,
  nameId,
  triggerId,
  onApprovalResponse,
}) => {
  const messages = getMessages();
  const [isResponding, startTransition] = useTransition();
  // 答えると問いのバーごと消え、押したボタンにあったフォーカスが body に
  // 落ちる。消える直前（ref の解除は DOM から外すより先に走る）にまだ
  // フォーカスを持っていたら、同じツールの見出しへ移す。見出しは
  // Server Component の ToolInvocation が組むので ref は届かず、id で引く
  const keepFocusOnAnswer = useCallback(
    (group: HTMLDivElement) => () => {
      if (group.contains(document.activeElement)) {
        document
          .querySelector<HTMLElement>(`#${CSS.escape(triggerId)}`)
          ?.focus();
      }
    },
    [triggerId],
  );

  const respond = (approved: boolean) => {
    startTransition(async () => {
      await onApprovalResponse?.({ id: approval.id, approved });
    });
  };

  return (
    <div
      aria-labelledby={nameId}
      className="flex flex-wrap items-center gap-2"
      ref={keepFocusOnAnswer}
      role="group"
    >
      <p className="text-fg-base min-w-0 flex-1 text-sm">
        {approval.requestReason ?? messages.toolApprovalRequest}
      </p>
      {onApprovalResponse !== undefined && (
        <div className="flex shrink-0 gap-2">
          <Button
            color="base"
            disabled={isResponding}
            onClick={() => {
              respond(false);
            }}
            size="sm"
            variant="outline"
          >
            {messages.toolDeny}
          </Button>
          <Button
            disabled={isResponding}
            onClick={() => {
              respond(true);
            }}
            size="sm"
          >
            {messages.toolApprove}
          </Button>
        </div>
      )}
    </div>
  );
};
