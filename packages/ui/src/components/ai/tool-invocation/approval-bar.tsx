'use client';

import { useTransition } from 'react';
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

  const respond = (approved: boolean, button: HTMLButtonElement) => {
    // 送るあいだボタンは disabled になり、フォーカスを持っていても
    // ブラウザが body へ落とす。問いのバーも答えが届けば消えるので、
    // 無効にする前に同じツールの見出しへ移す。見出しは Server Component の
    // ToolInvocation が組むので ref は届かず、id で引く
    if (button === document.activeElement) {
      document.querySelector<HTMLElement>(`#${CSS.escape(triggerId)}`)?.focus();
    }
    startTransition(async () => {
      await onApprovalResponse?.({ id: approval.id, approved });
    });
  };

  return (
    <div
      aria-labelledby={nameId}
      className="flex flex-wrap items-center gap-2"
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
            onClick={(event) => {
              respond(false, event.currentTarget);
            }}
            size="sm"
            variant="outline"
          >
            {messages.toolDeny}
          </Button>
          <Button
            disabled={isResponding}
            onClick={(event) => {
              respond(true, event.currentTarget);
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
