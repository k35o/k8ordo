'use client';

import { useCallback, useOptimistic } from 'react';
import type { FC } from 'react';

import { getMessages } from '../../../i18n/current';
import { Button } from '../../buttons/button';
import type { ToolApproval, ToolApprovalResponse } from '../types';

import styles from './approval-bar.module.css';

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
  // 答えている間、押していない方だけをネイティブの disabled にする。押した方を
  // disabled にすると Chromium は描画の更新のあとでフォーカスを body へ外し、
  // バーが消えるときに見出しへ移せなくなる。押した方は Button の action の保留で
  // aria-disabled になり、二度目の答えは Button が止める
  const [answering, setAnswering] = useOptimistic<boolean | undefined>(
    undefined,
  );
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

  const respond = (approved: boolean) => async () => {
    setAnswering(approved);
    await onApprovalResponse?.({ id: approval.id, approved });
  };

  return (
    <div
      aria-labelledby={nameId}
      className={styles.root}
      ref={keepFocusOnAnswer}
      role="group"
    >
      <p className={styles.request}>
        {approval.requestReason ?? messages.toolApprovalRequest}
      </p>
      {onApprovalResponse !== undefined && (
        <div className={styles.buttons}>
          <Button
            action={respond(false)}
            color="base"
            disabled={answering === true}
            size="sm"
            variant="outline"
          >
            {messages.toolDeny}
          </Button>
          <Button
            action={respond(true)}
            disabled={answering === false}
            size="sm"
          >
            {messages.toolApprove}
          </Button>
        </div>
      )}
    </div>
  );
};
